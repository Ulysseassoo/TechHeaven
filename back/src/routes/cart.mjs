import express from "express";
import { validationResult } from "express-validator";
import { db } from "../utils/db.server.mjs";
import { shouldBeAuthenticate } from "../middlewares/authentication.mjs";
import { basketValidator } from '../validator/basketValidator.mjs'

const router = express.Router();

router.get("/basket", shouldBeAuthenticate, async (req, res) => {
    try {
        const user = req.user

        const basket = await db.cart.findFirst({
            where: {
                user_id: user.id
            }
        })

        if (!basket) {
            return res.status(400).json({ status: 400, message: 'Panier inexistant.' });
        }

        if (!(req.user.id === basket.user_id)) {
            return res.status(401).json({ status: 401, message: "Vous ne pouvez pas intéragir avec ce panier." });
        }

        return res.status(200).json({
            status: 200,
            data: basket
        })
    } catch (error) {
        console.log("🚀 ~ router.get ~ error:", error)
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.get('/basket/:id/products', shouldBeAuthenticate, async (req, res) => {
    try {
        const user = req.user
        const basket = await db.cart.findFirst({
            where: {
                user_id: user.id
            }
        })

        if (!basket) {
            return res.status(400).json({ status: 400, message: 'Panier inexistant.' });
        }

        if (!(req.user.id === basket.user_id)) {
            return res.status(401).json({ status: 401, message: "Vous ne pouvez pas intéragir avec ce panier." });
        }

        const basketProducts = await db.cartHasProducts.findMany({
            where: {
                cart_id: basket.id
            },
            include: {
                product: true
            }
        })

        return res.status(200).json({
            status: 200,
            data: basketProducts
        })
    } catch (error) {
        console.log("🚀 ~ router.get ~ error:", error)
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.put("/basket", basketValidator, shouldBeAuthenticate, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).send({
            status: 401,
            message: errors.formatWith(({ msg, path }) => {
                return {
                    msg,
                    path
                }
            }).array()
        });
    } 
    
    try {
        const user = req.user
        const { product_id, action } = req.body

        const basket = await db.cart.findFirst({
            where: {
                user_id: user.id
            }
        })

        if (!basket) {
            return res.status(400).json({ status: 400, message: "Panier non trouvé" });
        }

        const productInCart = await db.cartHasProducts.findFirst({
            where: {
                product_id
            },
            include: {
                product: true
            }
        })

        const p = await db.cartHasProducts.findFirst({
            where: {
                product_id
            },
        })
        if (productInCart) {

            if (action === "delete") {
                await db.cartHasProducts.delete({
                    where: {
                        id: productInCart.id
                    }
                })

                await db.cart.update({
                    where: {
                        id: basket.id
                    },
                    data: {
                        ...basket,
                        total: basket.total - (productInCart.product.price * productInCart.quantity)
                    }
                })

                await db.product.update({
                    where: {
                        id: productInCart.product.id
                    },
                    data: {
                        ...productInCart.product,
                        quantity: productInCart.product.quantity + productInCart.quantity
                    }
                })
                return res.status(200).json({ status: 200, message: 'Produit supprimé du panier'});
            }

            if (action === 'remove'){
                if (productInCart.quantity === 1) {
                    await db.cartHasProducts.delete({
                        where: {
                            id: productInCart.id
                        }
                    })
                    return res.status(200).json({ status: 200, message: 'Produit supprimé du panier'});
                }
                const basketProductUpdated = await db.cartHasProducts.update({
                    where: {
                        id: productInCart.id
                    },
                    data: {
                        ...p,
                        quantity: productInCart.quantity - 1
                    }
                })

                await db.cart.update({
                    where: {
                        id: basket.id
                    },
                    data: {
                        ...basket,
                        total: basket.total - productInCart.product.price
                    }
                })

                await db.product.update({
                    where: {
                        id: productInCart.product.id
                    },
                    data: {
                        ...productInCart.product,
                        quantity: productInCart.product.quantity + 1
                    }
                })

                return res.status(200).json({
                    status: 200,
                    data: basketProductUpdated
                })
            }

            if (action === 'add') {
                if (productInCart.product.quantity) {
                    const basketProductUpdated = await db.cartHasProducts.update({
                        where: {
                            id: productInCart.id,
                        },
                        data: {
                            ...p,
                            quantity: productInCart.quantity + 1
                        }
                    })

                    await db.cart.update({
                        where: {
                            id: basket.id
                        },
                        data: {
                            ...basket,
                            total: basket.total + productInCart.product.price
                        }
                    })

                    await db.product.update({
                        where: {
                            id: productInCart.product.id
                        },
                        data: {
                            ...productInCart.product,
                            quantity: productInCart.product.quantity - 1
                        }
                    })
                    return res.status(200).json({ status: 200, data:  basketProductUpdated});
                } else {
                    return res.status(409).json({ status: 409, message: "Le produit n'est plus en stock." });
                }
            }
        }

        if (action === 'add') {
            const productToAdd = await db.product.findUnique({
                where: {
                    id: product_id
                }
            })

            if (productToAdd) {
                if (productToAdd.quantity) {

                    const productAdded = await db.cartHasProducts.create({
                        data: {
                            cart_id: basket.id,
                            product_id: productToAdd.id,
                            quantity: 1,
                            unit_price: productToAdd.price.toString()
                        }
                    })

                    await db.cart.update({
                        where: {
                            id: basket.id
                        },
                        data: {
                            ...basket,
                            total: basket.total + productToAdd.price
                        }
                    })

                    await db.product.update({
                        where: {
                            id: productToAdd.id
                        },
                        data: {
                            ...productToAdd,
                            quantity: productToAdd.quantity - 1
                        }
                    })

                    return res.status(200).json({
                        status: 200,
                        data: productAdded
                    })
                } else {
                    return res.status(409).json({ status: 409, message: "Le produit n'est plus en stock." });
                }

            }

            return res.status(400).json({
                status: 400,
                message: 'Produit inconnu.'
            })
        }

        if (action === 'remove' || action === "delete") {
            return res.status(400).json({
                status: 400,
                message: 'Action non effectuable.'
            })
        }

        return res.status(200).json({
            status: 200,
            data: basket
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message || error,
        });
    }
})

router.delete("/basket", shouldBeAuthenticate, async (req, res) => {
    const user = req.user
    try {
        const basket = await db.cart.findFirst({
            where: {
                user_id: user.id
            }
        })

        if (!basket) {
            return res.status(400).json({ status: 400, message: 'Panier inexistant.' });
        }

        await db.cartHasProducts.deleteMany({
            where: {
                cart_id: basket.id
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Panier vidé avec succès"
        })
    } catch (error) {
        return res.status(401).send({
            status: 401,
            message: error.message,
        });
    }
})

export default router;