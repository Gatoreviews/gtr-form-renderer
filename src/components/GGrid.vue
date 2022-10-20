<template>
  <div class="g-grid">
    <component :is="element.type === 'grid' ? 'v-row' : 'div'" v-for="(element, i) in elements" :key="i">
      <v-col
        v-for="(column, j) in element.gridItems"
        :key="j"
        :cols="column.columns.default"
        :sm="column.columns.sm ? column.columns.sm : null"
        :md="column.columns.md ? column.columns.md : null"
        :lg="column.columns.lg ? column.columns.lg : null"
        :xl="column.columns.xl ? column.columns.xl : null"
      >
        <g-grid v-if="column.elements && column.elements.length > 0" :elements="column.elements">
          <template slot="field" slot-scope="{ field }">
            <slot v-if="field.type === 'field'" name="field" :field="field"></slot>
          </template>
        </g-grid>
      </v-col>
      <slot v-if="element.type === 'field'" name="field" :field="element"></slot>
    </component>
  </div>
</template>

<script>
import GGrid from '@/components/GGrid.vue'

export default {
  name: 'GGrid',
  components: {
    GGrid,
  },
  props: {
    elements: {
      type: Array,
      required: true,
    },
  },
}
</script>
