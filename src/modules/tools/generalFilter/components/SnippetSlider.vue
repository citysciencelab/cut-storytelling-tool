<script>
export default {
    name: "SnippetSlider"
};
</script>

<template>
    <div>
        <label for="slider">slider: </label>
        <input
            type="range"
            min="1"
            max="100"
            value="50"
        >
    </div>
</template>

<style lang="less" scoped>
    @import "~/css/mixins.less";
    input[type='range'] {
        -webkit-appearance: none;
        background-color: #ddd;
        height: 15px;
        overflow: hidden;
        width: 100%;
    }

    input[type='range']::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: 15px;
    }

    input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: -210px 0 0 200px #3177b1;
        cursor: pointer;
        height: 15px;
        width: 15px;
        border: 0;
    }

    input[type='range']::-moz-range-thumb {
        background: #ffffff;
        border-radius: 50%;
        box-shadow: -1010px 0 0 1000px #3177b1;
        cursor: pointer;
        height: 15px;
        width: 15px;
        border: 0;
    }

    input[type="range"]::-moz-range-track {
        background-color: #ddd;
    }
    input[type="range"]::-moz-range-progress {
        background-color: #3177b1;
        height: 15px
    }
    input[type="range"]::-ms-fill-upper {
        background-color: #ddd;
    }
    input[type="range"]::-ms-fill-lower {
        background-color: #3177b1;
    }
</style>
