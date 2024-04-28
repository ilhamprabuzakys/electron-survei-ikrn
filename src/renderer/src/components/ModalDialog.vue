<script setup>
defineProps({
    id: String,
    isForm: {
        type: Boolean,
        default: false,
    },
    scrollable: {
        type: Boolean,
        default: false
    },
    centered: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: 'lg'
    },
});

defineEmits(['submit']);
</script>

<template>
    <div
        class="modal fade"
        :id="id"
        tabindex="-1"
        role="dialog"
    >
        <div

            :class="`modal-dialog modal-${size}
            ${centered ? 'modal-dialog-centered' : ''}
            ${scrollable ? 'modal-dialog-scrollable' : ''}`"
            role="document"
        >
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <slot name="header"></slot>
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <form @submit.prevent="$emit('submit', $event)" v-if="isForm">
                    <div class="modal-body">
                        <slot name="body"></slot>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">
                            <i class="fas fa-xmark me-2"></i>
                            Tutup
                        </button>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-save me-2"></i>
                            Simpan Data
                        </button>
                    </div>
                </form>
                <slot v-else name="body"></slot>
            </div>
        </div>
    </div>
</template>
