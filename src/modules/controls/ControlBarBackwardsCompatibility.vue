<script>
/**
 * NOTE This is a temporary implementation. As soon as "old-style" controls
 * are no longer supported, this component and all uses of it can be removed.
 */
export default {
    name: "ControlBarBackwardsCompatibility",
    props: {
        /** id to use - jQuery adds old controls by this */
        id: {
            type: String,
            required: true
        }
    }
};
</script>

<template>
    <div
        :id="id"
        class="backwards-compatibility-controls"
    />
</template>

<style lang="scss">
    @import "~variables";

    /* using this classname to scope css effects; can not use scoped scss here since controls are not within scope, but added by jQuery */
    .backwards-compatibility-controls {
        /* use old styling way for icons for old controls */
        .bootstrap-icon {
            color: $black;
            background-color: $light_grey;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.176);
            &:hover {
                cursor: pointer;
                background-color: $light_grey_hover;
            }
            &:focus {
                background-color: $light_grey_focus;
                outline: 1px solid $light_grey_outline;
            }
            &:active {
                background-color: $light_grey_active;
            }
        }
        > .toggleButtonPressed {
            background-color: $light_blue;
        }
        /* forcing compatibility by overriding old-style layouting */
        .controls-row-right {
            position: relative;
            margin-right: 0;
            min-height: 0;
        }
        .row {
            margin-right: 0;
            margin-left: 0;

            > * {
                padding-right: 0;
                padding-left: 0;
            }
        }
        > div {
            padding: 5px;
            > div {
                margin-top: 0;
            }
        }
    }
</style>
