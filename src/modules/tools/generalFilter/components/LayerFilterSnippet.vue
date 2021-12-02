<script>
import SnippetButton from "./SnippetButton.vue";
import SnippetCheckbox from "./SnippetCheckbox.vue";
import SnippetDate from "./SnippetDate.vue";
import SnippetDropdown from "./SnippetDropdown.vue";
import SnippetInput from "./SnippetInput.vue";
import SnippetSlider from "./SnippetSlider.vue";

export default {
    name: "LayerFilterSnippet",
    components: {
        SnippetCheckbox,
        SnippetDate,
        SnippetDropdown,
        SnippetInput,
        SnippetSlider,
        SnippetButton
    }
};
</script>

<template>
    <div>
        <div class="snippet">
            <b>Checkbox Snippet</b>
            <SnippetCheckbox />
        </div>
        <div class="snippet">
            <b>Dropdown Snippet</b>
            <SnippetDropdown />
        </div>
        <div class="snippet">
            <b>Input Snippet</b>
            <SnippetInput />
        </div>
        <div class="snippet">
            <b>Datepicker Snippet</b>
            <SnippetDate />
        </div>
        <div class="snippet">
            <b>Slider Snippet</b>
            <SnippetSlider />
        </div>
        <div class="snippet">
            <SnippetButton />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    .snippet {
        display: block;
        margin-bottom: 20px;
        b {
            display: block;
        }
    }
</style>
