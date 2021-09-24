<script>
import * as constantsRouting from "../store/constantsRouting";
export default {
    name: "RoutingAvoidFeatures",
    props: {
        activeAvoidFeaturesOptions: {
            type: Array,
            required: true
        },
        settings: {
            type: Object,
            required: true
        },
        disabled: {
            type: Boolean,
            required: false
        }
    },
    data () {
        return {
            showAvoidFeatures: false
        };
    },
    computed: {
        avoidSpeedProfileOptions ({settings}) {
            return constantsRouting.avoidSpeedProfileOptions.filter(
                (option) => option.availableProfiles.includes(settings.speedProfile)
            );
        }
    },
    methods: {
        getIsRoutingAvoidFeaturesOptionsChecked (option) {
            return this.activeAvoidFeaturesOptions.includes(option.id);
        },

        setRoutingAvoidFeaturesOptions (option, checked) {
            if (checked) {
                this.$emit("addAvoidOption", option.id);
            }
            else {
                this.$emit("removeAvoidOption", option.id);
            }
        }
    }

};
</script>

<template>
    <div class="d-flex flex-column">
        <b
            class="pointer"
            @click="showAvoidFeatures = !showAvoidFeatures"
            @keydown.enter="showAvoidFeatures = !showAvoidFeatures"
        >
            <span
                v-if="showAvoidFeatures"
                class="pointer glyphicon glyphicon-chevron-down"
            />
            <span
                v-else
                class="pointer glyphicon glyphicon-chevron-right"
            />
            {{ $t('common:modules.tools.routing.avoidOptions.header') }}
        </b>
        <div
            v-if="showAvoidFeatures"
            class="d-flex flex-column ml-4"
        >
            <label
                v-for="option in avoidSpeedProfileOptions"
                :key="option.id"
                class="pointer"
            >
                <input
                    type="checkbox"
                    :value="option.id"
                    :checked="getIsRoutingAvoidFeaturesOptionsChecked(option)"
                    :disabled="disabled"
                    @change="
                        setRoutingAvoidFeaturesOptions(option, $event.target.checked)
                    "
                >
                <span class="ml-2">{{ $t('common:modules.tools.routing.avoidOptions.' + option.id) }}</span>
            </label>
        </div>
    </div>
</template>

<style scoped>

.d-flex {
    display: flex;
}
.flex-column {
    flex-direction: column;
}

.pointer {
    cursor: pointer;
}

.ml-4 {
    margin-left: 1rem;
}
.ml-2 {
    margin-left: 0.5rem;
}
</style>
