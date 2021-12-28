<template>
  <q-card style="width: 700px; max-width: 80vw" class="q-mt-md">
    <q-toolbar>
      <q-avatar>
        <q-icon color="deep-purple" name="info" />
      </q-avatar>

      <q-toolbar-title
        ><span class="text-weight-bold">Sobre</span></q-toolbar-title
      >

      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>
    <q-card-section class="q-pt-none q-mt-md q-gutter-sm">
      <strong>TaniaDBPocket</strong> é um projeto desenvolvido por Emanuel
      Augusto em homenagem a sua avó. Com intuito de ajudar iniciantes no mundo
      dos bancos de dados, oferecendo uma interface mais simples e amigavel, com
      ajuda do material design 2.0.
    </q-card-section>
    <q-card-section class="q-pt-none q-mt-md q-gutter-sm text-h5 text-red flex flex-center">
      <h5>Não use em Produção</h5>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  name: "About",
};
</script>
