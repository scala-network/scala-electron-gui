<template>
<div class="tx-icon" v-if="type=='in'">
    <q-icon name="call_received" size="40px" class="main-icon" />
</div>
<div class="tx-icon" v-else-if="type=='out'">
    <q-icon name="call_made" size="40px" class="main-icon" />
</div>
<div class="tx-icon" v-else-if="type=='pool'">
    <q-icon name="call_received" size="40px" class="main-icon" />
    <q-icon name="access_time" size="14px" class="sub-icon" />
</div>
<div class="tx-icon" v-else-if="type=='pending'">
    <q-icon name="call_made" size="40px" class="main-icon" />
    <q-icon name="access_time" size="14px" class="sub-icon" />
</div>
<div class="tx-icon" v-else-if="type=='failed'">
    <q-icon name="close" size="40px" class="main-icon" color="red" />
</div>
</template>

<script>
export default {
    name: "TxTypeIcon",
    props: {
        type: {
            type: String,
            required: true
        },
        tooltip: {
            type: Boolean,
            default: true,
            required: false
        }
    },
}
</script>

<style>
.tx-icon {
width: 32px;
height: 32px;
position:relative;
}
.tx-icon .main-icon {
margin: -4px 0 0 -4px;
}
.tx-icon .sub-icon {
width: 14px;
height: 14px;
position:absolute;
bottom: -3px;
right: 0;
}
</style>
