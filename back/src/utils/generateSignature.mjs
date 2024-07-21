import crypto from 'crypto';

function generateFakeSignature(payload, secret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;
    const signature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');
    return `t=${timestamp},v1=${signature}`;
}

// Exemple d'utilisation
const payload = JSON.stringify({
    type: 'payment_intent.succeeded',
    data: {
        object: {
            id: 'pi_1FfGJSGz6dsz4t',
            metadata: {
                invoiceId: '9'
            }
        }
    }
});

const secret = 'sk_test_IWXNNdz4d5fdHLA362PzpJGS00G15qtESV';  // Utilisez votre secret de test Stripe webhook
const signature = generateFakeSignature(payload, secret);
console.log('Generated Signature:', signature);
console.log('Payload:', payload);
