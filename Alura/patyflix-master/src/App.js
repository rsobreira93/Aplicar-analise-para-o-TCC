import React from 'react';
import Navbar from './components/Navbar';

import dadosIniciais from './data/dados_iniciais.json';
import Carousel from './components/Carousel';

import BannerMain from './components/BannerMain';

function App() {
  return (
    <div style={{ background: '#141414' }}>
      <Navbar></Navbar>
      <BannerMain
        videoTitle={dadosIniciais.categorias[0].videos[0].titulo}
        url={dadosIniciais.categorias[0].videos[0].url}
        videoDescription={`O que é Front Front-end? Trabalhando na área os termos HTML, 
        CSS e JavaScript fazem parte da rotina das desenvolvedoras e desenvolvedores.
        Mas o que eles fazem, afinal? Descubra com a Vanessa!`}
      />

      <Carousel
        ignoreFirstVideo
        category={dadosIniciais.categorias[0]}
      ></Carousel>
      <Carousel category={dadosIniciais.categorias[1]}></Carousel>
      <Carousel category={dadosIniciais.categorias[2]}></Carousel>
      <Carousel category={dadosIniciais.categorias[3]}></Carousel>
      <Carousel category={dadosIniciais.categorias[4]}></Carousel>
      <Carousel category={dadosIniciais.categorias[5]}></Carousel>
    </div>
  );
}

export default App;
