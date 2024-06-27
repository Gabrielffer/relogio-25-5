
import './App.css';
import './dispMoveis.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import {useState, useRef} from 'react';

function App(){
  const [tempoIntervalo, atualizarTI] = useState(5);
  const [tempoSecao, atualizarTS] = useState(25);
  const [tempoRestante, atualizarTempo] = useState('25:00');
  const [statusCronometro, atualizarStatusCronometro] = useState({
    status: false,
    icone: 'bi bi-play-fill'
  });
  const [rotuloTipoCron, atualizarRotuloTipoCron] = useState('Seção');

  const cronometroRef = useRef(null);
  const tempoPausa = useRef(null);
  const btReset = useRef();
  const audioRef = useRef();

  const tratarBL = (operacao) => {
    if(!statusCronometro.status){
      if(operacao === '+'){
        atualizarTI(blAnterior => {
          if(blAnterior < 60){
            const min = blAnterior + 1;
            if(rotuloTipoCron === 'Intervalo'){
              atualizarTempo(adZero(min) + ':00');
            }
            return min;
          }
          return blAnterior;
        });
      }else if(operacao === '-'){
        atualizarTI(blAnterior => {
          if(blAnterior > 1){
            const min = blAnterior - 1;
            if(rotuloTipoCron === 'Intervalo'){
              atualizarTempo(adZero(min) + ':00');
            }
            return min;
          }
          return blAnterior;
        });
      }
    }
  }

  const tratarSL = (operacao) => {
    if(!statusCronometro.status){
      if(operacao === '+'){
        atualizarTS(slAnterior => {
          if(slAnterior < 60){
            const min = slAnterior + 1;
            if(rotuloTipoCron === 'Seção'){
              atualizarTempo(adZero(min) + ':00');
            }
            return min;
          }
          return slAnterior;
        });
      }else if(operacao === '-'){
        atualizarTS(slAnterior => {
          if(slAnterior > 1){
            const min = slAnterior - 1;
            if(rotuloTipoCron === 'Seção'){
              atualizarTempo(adZero(min) + ':00');
            }
            return min;

          }
          return slAnterior;
        });
      }
    }
  }

  const adZero = (num) => {
    if(num < 10){
      return '0' + num;
    }
    return num;
  }

  const tratarCronometro = () => {
    if(tempoRestante !== '00:00'){
      if(!statusCronometro.status){
        atualizarStatusCronometro({
          status: true,
          icone: 'bi bi-pause-fill'
        });
        let [minutos, segundos] = tempoRestante.split(':').map(num => parseInt(num));
        cronometrar(minutos, segundos);
      }else{
        atualizarStatusCronometro({
          status: false,
          icone: 'bi bi-play-fill'
        });
        clearInterval(cronometroRef.current);
      }
    }
  }

  const cronometrar = (minutos, segundos) => {
    cronometroRef.current = setInterval(() => {
      if(minutos === 0 && segundos === 0){
        clearInterval(cronometroRef.current);
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        tempoPausa.current = setTimeout(() => {
          if(rotuloTipoCron === 'Seção'){
            cronometrar(tempoIntervalo, 0);
            atualizarRotuloTipoCron('Intervalo');
            atualizarTempo(adZero(tempoIntervalo) + ':00');
          }else{
            cronometrar(tempoSecao, 0);
            atualizarRotuloTipoCron('Seção');
            atualizarTempo(adZero(tempoSecao) + ':00');
          }
        }, 4200);
        return;
      }
      if(segundos === 50){
        document.getElementById('start_stop').click();
        setTimeout(() => document.getElementById('start_stop').click(), 30);
      }
      if(segundos > 0){
        segundos--;
      }else{
        segundos = 59;
        if(minutos > 0){
          minutos--;
        }
      }
      atualizarTempo(adZero(minutos) + ':' + adZero(segundos));
    }, 1000);
  }

  const resetar = () => {
    atualizarTI(5);
    atualizarTS(25);
    atualizarTempo('25:00');
    atualizarRotuloTipoCron('Seção');
    clearInterval(cronometroRef.current);
    clearTimeout(tempoPausa.current);
    cronometroRef.current = null;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    atualizarStatusCronometro({
      status: false,
      icone: 'bi bi-play-fill'
    });
  }

  return (
    <div className='container bg-' id='container'>
      <header className='container bg- text-center'>
        <h1>Relógio 25 + 5</h1>
      </header>
      <div className='container-fluid' id='div_config'>
        <div className='subdiv_config'>
          <div id='break-label'>Tempo Intervalo</div>
          <button id='break-increment' className='btn btn-warning' onClick={() => tratarBL('+')}>
            <i className='bi bi-arrow-up-short'></i>
          </button>
          <span id='break-length' className='comprimento'>{tempoIntervalo}</span>
          <button id='break-decrement' className='btn btn-warning' onClick={() => tratarBL('-')}>
            <i className='bi bi-arrow-down-short'></i>
          </button>
        </div>
        <div className='subdiv_config'>
          <div id='session-label'>Tempo Seção</div>
          <button id='session-increment' className='btn btn-warning' onClick={() => tratarSL('+')}>
            <i className='bi bi-arrow-up-short'></i>
          </button>
          <span id='session-length' className='comprimento'>{tempoSecao}</span>
          <button id='session-decrement' className='btn btn-warning' onClick={() => tratarSL('-')}>
            <i className='bi bi-arrow-down-short'></i>
          </button>
        </div>
      </div>
      <div className='container-fluid' id='div_tempo'>
        <div>
          <h2 id='timer-label'>{rotuloTipoCron}</h2>
          <div id='time-left'>{tempoRestante}</div>
        </div>
      </div>
      <div className='container-fluid' id='div_controle'>
        <button id='start_stop' className='btn btn-success btn-lg' onClick={() => tratarCronometro()}>
          <i className={statusCronometro.icone}></i>
        </button>
        <button id='reset' className='btn btn-danger btn-lg' onClick={() => resetar()} ref={(ref) => btReset.current = ref}>
          <i className='bi bi-arrow-repeat'></i>
        </button>
      </div>
      <footer>
        <p>Desenvolvido por <a href='https://github.com/Gabrielffer' target='_blank' className='text-primary'>Gabriel F.F</a></p>
        <p>Áudio de retirado de <a href='https://pixabay.com/pt/sound-effects/race-start-beeps-125125/' target='_blank' className='text-success'>Pixabay</a></p>
        <p>Certifique-se de que o volume do seu sistema e da aba do navegador estejam ativados</p>
      </footer>
      <audio id='beep' src='./beep.mp3' type='audio/mp3' ref={(ref) => audioRef.current = ref}></audio>
    </div>
  );
}

export default App;