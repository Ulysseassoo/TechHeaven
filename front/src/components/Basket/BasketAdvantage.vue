<script setup lang="ts">
    import ProtectionIcon from '../Icons/ProtectionIcon.vue';
</script>
<template>
    <div class="advantages-container">
        <div class="advantage-container first">
            <div class="advantage-icon-container">
                <ProtectionIcon width="50px" height="50px" />
            </div>
            <div>
                <p>Garantie pendant 12 mois</p>
            </div>
        </div>

        <div class="advantage-container second">
            <div class="advantage-icon-container">
                <ProtectionIcon width="50px" height="50px" />
            </div>
            <div>
                <p>Garantie pendant 12 mois</p>
            </div>
        </div>

        <div class="advantage-container">
            <div class="advantage-icon-container">
                <ProtectionIcon width="50px" height="50px" />
            </div>
            <div>
                <p>Garantie pendant 12 mois</p>
            </div>
        </div>

        <div class="advantage-container">
            <div class="advantage-icon-container">
                <ProtectionIcon width="50px" height="50px" />
            </div>
            <div>
                <p>Garantie pendant 12 mois</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.advantages-container {
    display: flex;
    flex-wrap: wrap;
    background: white;
    padding: 30px 50px;
    border-radius: 10px;
}
.advantage-container {
    width: 50%;
    display: flex;
    align-items: center;
}

.advantage-icon-container {
    background: #D9E4FC;
    padding: 15px;
    border-radius: 8px;
    margin-right: 15px;
}

p {
    font-size: 18px;
    font-weight: 600;
}

.first, .second {
    margin-bottom: 30px;
}
</style>