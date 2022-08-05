import debounce from "./debounce.js";
export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0, // posição final do slide
      startX: 0, // vai ser pra salvar a referencia inicial de onde esta o meu mouse
      movement: 0 // total que se moveu no momento que cliquei
    }
    this.activeClass = 'active';
    this.changeEvent = new Event('changeEvent');
  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : ''
  }

  moveSlide(distX) {
    // Sempre que eu mover o slide eu posso salvar a distancia
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    // No mousemove vou fazer o calculo entre a diferença de quando cliquei e a referencia do novo
     // o valor de this.dist.startX vai ser fixo pq quando clico ele só vai ativar uma vez
     // ja o valor de clientX vai sendo atualizado conforme arrastar
    this.dist.movement = (this.dist.startX - clientX) * 1.6; // multiplica por 1.6 para ficar mais rapido o movimento, fica a sua escolha
    console.log(this.dist.movement);
    return this.dist.finalPosition - this.dist.movement; 
  }

  onStart(event) {
    let moveType;
    // se for mousedown teremos o preventDefault, caso contrario (no de touch, mobile) nao teremos
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.startX = event.clientX;
      console.log(this.dist.startX);
      console.log('nao é mobile');
      moveType = 'mousemove';
    } else { // se for o event de touchstart (mobile)
      console.log('mobile');
      this.dist.startX = event.changedTouches[0].clientX; // pega do zero pois queremos o primeiro toque do primeiro dedo
      moveType = 'touchmove';
    }
    
   
    // console.log(this);
    console.log('mousedown');
    this.wrapper.addEventListener(moveType, this.onMove); // adiciona o evento ao dar o primeiro clique, conforme eu segurar e ir arrastando o mouse ele vai ativndo o evento

    this.transition(false);
  }

  onMove(event) {
    const pointerPosition = (event.type === 'mousemove') ? event.clientX :  event.changedTouches[0].clientX // pointer pode ser o dedo ou o mouse
    console.log('moveu');
    const finalPosition = this.updatePosition(pointerPosition);

    // sempre que o onMove for ativado e pegar a finalPosition vou mover o moveSlide para a posição final
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    console.log('acabou');
    this.wrapper.removeEventListener(moveType, this.onMove);

    // Quando a pessoa tirar o mouse de cima quero guardar esse valor na finalPosition o valor
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  // Muda o slide ao final, ou seja, quando terminar o movimento
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide(); // Ativa proximo slide
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide(); // Ativa slide anterior
    } else {
      this.changeSlide(this.index.active);
    }
    // Quando o movimento for positivo ele vai para o proximo slide, quando o movimento for negativo ele vai para o anterior
  }

  addSlideEvents() {
    // mousedown ativa o evento quando clico
    this.wrapper.addEventListener('mousedown', this.onStart);

    // touchstart é um evento igual ao mousedown mas 
    this.wrapper.addEventListener('touchstart', this.onStart);

     // mouseup ativa o evento quando desclicar o mouse
    this.wrapper.addEventListener('mouseup', this.onEnd);

    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  // Slides config (configuração de cada slide)
  slidePosition (slide) { 
    // Vai calcular o posicionamento exato pra colocar o slide no centro
    // Basta pegar o total da tela - o total do elemento que vai sobrar as margens do elemento e esse valor divido por 2 deixando uma margem pra cada lado
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin); // obs o valor precisa ser negativo se nao muda o sentido dos slides, é um valor para o slide ficar no centro
  }
  slidesConfig() {
    // Primeiro transforma em uma array para que assim que consiga colocar a array dentro da classe
    // O map retorna por padrao uma array modificada de acordo com o que vc usou no return, neste caso vou retornar o objeto
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element }
    }); 
    console.log(this.slideArray);
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1; // ultimo slide
    this.index = {
      prev: index ? index - 1 : undefined, // slide anterior
      active: index, // slide atual
      next: index === last ? undefined : index + 1 // proximo slide
    }
  }

  // Muda o slide de acordo com o index passado nele
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    console.log(this.index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();

    // Toda vez que o slide mudar, o evento será ativado
    this.wrapper.dispatchEvent(this.changeEvent); // É uma função que posso colocar em qualquer elemento 
  }

  changeActiveClass() {
    this.slideArray.forEach(item => item.element.classList.remove(this.activeClass));
    // Seleciona o item que está ativo
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  // Ativa o slide anterior
  activePrevSlide() {
    if (this.index.prev !== undefined) { // se tiver slide anterior
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) { // se tiver proximo slide
      this.changeSlide(this.index.next);
    }
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  // todo evento dentro de classe precisa ter o bind, pra fazer referencia ao objeto
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);

    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0);
    return this;
  }
}

export class SlideNav extends Slide {
  constructor(slide, wrapper) {
    // quando uso construtor de uma classe extendida, tenho que usar o super() pra puxar todos os argumentos do constructor anterior, porem preciso passar eles iguais
    super(slide, wrapper); 
    this.bindControlEvents();
  }
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement('ul');
    control.dataset.control = 'slide';
  
    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index  + 1}">${index + 1}</a></li>`;
    });
    this.wrapper.appendChild(control);
    console.log(control);
    return control;
  }

  eventControl(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.changeSlide(index);
    });
    this.wrapper.addEventListener('changeEvent', this.activeControlItem); // toda vez que muda o slide ativa 
  }

  activeControlItem() {
    this.controlArray.forEach(item => item.classList.remove(this.activeClass));
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(customControl) {
    // Se o controle "customControl" nao for passado, ele vai criar o control (createControl)
    this.control = document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];
    console.log('this.control é: ', this.control);
    console.log('this.controlArray é: ', this.controlArray);

    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }

  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
}