<script>
export default {
    name: "ProgressBar",
    props: {
        delay: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            value: 0,
            id: 0,
            max: 100
        };
    },
    mounted () {
        this.id = setInterval(this.progress, this.delay);
    },
    methods: {
        progress () {
            if (this.value < this.max) {
                this.value++;
            }
            else {
                clearInterval(this.id);
            }
        }
    }
};
</script>

<template>
    <div class="progress-container">
        <progress
            id="progressbar"
            :value="value"
            :max="max"
        />
        <span class="progress-value">{{ value }}%</span>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    progress {
        border-radius: 7px;
        width: 100%;
        height: 12px;
        box-shadow: 1px 1px 4px rgba( 0, 0, 0, 0.2 );
    }

    progress::-webkit-progress-bar {
        background-color: #fff;
        border-radius: 5px;
    }

    progress::-webkit-progress-value {
        background-color: #3177b1;
        border-radius: 5px;
    }

    progress::-moz-progress-bar {
        background-color: #fff;
        border-radius: 5px;
    }
    .progress-container {
        text-align: center;
    }
    .progress-value {
        text-align: left;
        margin: 0 auto;
        font-weight: bold;
    }
</style>
