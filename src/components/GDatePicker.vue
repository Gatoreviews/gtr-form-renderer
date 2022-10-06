<template>
  <v-menu v-model="menu" ref="menu" :close-on-content-click="false" :return-value.sync="date" min-width="auto">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        label="Picker in menu"
        readonly
        v-bind="attrs"
        v-on="on"
        outlined
        solo
        flat
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" no-title scrollable>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(date)"> OK </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    menu: false,
    modal: false,
    menu2: false,
  }),
}
</script>
