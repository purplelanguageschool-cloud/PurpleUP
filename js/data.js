// ===== DATA: Lições e exercícios por dia da semana =====
// Estrutura: LESSONS[lang][dayIndex] = array de lições
// lang: 'en' | 'es'  |  dayIndex: 0=seg, 1=ter, 2=qua, 3=qui, 4=sex, 5=sáb, 6=dom

const DEFAULT_LESSONS = {
  en: {
    0: [
      {
        id: 'en-0-1',
        title: 'Greetings & Introductions',
        type: 'vocabulary',
        meta: 'Vocabulário · 4 exercícios · ~5 min',
        icon: 'ti-vocabulary',
        questions: [
          { q: 'O que significa "How are you?"', opts: ['Onde você está?', 'Como vai você?', 'Quem é você?', 'Quando você vai?'], ans: 1 },
          { q: 'Tradução de "Nice to meet you!"', opts: ['Prazer em conhecê-lo!', 'Até logo!', 'Como vai?', 'Obrigado!'], ans: 0 },
          { q: 'Qual é o cumprimento para a tarde?', opts: ['Good morning', 'Good night', 'Good afternoon', 'Good evening'], ans: 2 },
          { q: '"My name is..." significa:', opts: ['Meu apelido é...', 'Meu nome é...', 'Eu moro em...', 'Eu tenho...'], ans: 1 },
        ]
      },
      {
        id: 'en-0-2',
        title: 'Numbers 1–20',
        type: 'vocabulary',
        meta: 'Vocabulário · 4 exercícios · ~6 min',
        icon: 'ti-123',
        questions: [
          { q: 'Como se escreve o número 15 em inglês?', opts: ['Fifty', 'Fifteen', 'Fiveteen', 'Fifth'], ans: 1 },
          { q: '"Twelve" em português é:', opts: ['Dois', 'Doze', 'Vinte', 'Onze'], ans: 1 },
          { q: 'Qual é o número após "nineteen"?', opts: ['Ninety', 'Twenty', 'Eighteen', 'Twenty-one'], ans: 1 },
          { q: '"Eight" em português é:', opts: ['Seis', 'Sete', 'Oito', 'Nove'], ans: 2 },
        ]
      }
    ],
    1: [
      {
        id: 'en-1-1',
        title: 'Simple Present',
        type: 'grammar',
        meta: 'Gramática · 4 exercícios · ~8 min',
        icon: 'ti-pencil',
        questions: [
          { q: 'Qual frase está correta no Simple Present?', opts: ['She work every day.', 'She works every day.', 'She working every day.', 'She is work every day.'], ans: 1 },
          { q: 'Complete: "He ___ to school by bus."', opts: ['go', 'going', 'goes', 'gone'], ans: 2 },
          { q: 'Quando usamos o Simple Present?', opts: ['Para ações que aconteceram ontem', 'Para hábitos e rotinas', 'Para ações que acontecerão amanhã', 'Para ações em progresso agora'], ans: 1 },
          { q: '"Do you like pizza?" — Resposta correta:', opts: ['Yes, I likes.', 'Yes, I do.', 'Yes, I am.', 'Yes, I does.'], ans: 1 },
        ]
      }
    ],
    2: [
      {
        id: 'en-2-1',
        title: 'Past Simple',
        type: 'grammar',
        meta: 'Gramática · 4 exercícios · ~8 min',
        icon: 'ti-clock',
        questions: [
          { q: 'Qual é o passado de "go"?', opts: ['Goed', 'Going', 'Went', 'Gone'], ans: 2 },
          { q: '"She ___ a book yesterday."', opts: ['read', 'reads', 'reading', 'is read'], ans: 0 },
          { q: 'O Past Simple é usado para:', opts: ['Ações habituais no presente', 'Ações que ocorreram no passado com tempo definido', 'Ações futuras', 'Ações em progresso'], ans: 1 },
          { q: 'Qual a forma negativa do Past Simple?', opts: ['He no went', 'He not went', 'He didn\'t go', 'He wasn\'t go'], ans: 2 },
        ]
      }
    ],
    3: [
      {
        id: 'en-3-1',
        title: 'Present Perfect',
        type: 'grammar',
        meta: 'Gramática · 4 exercícios · ~8 min',
        icon: 'ti-book',
        questions: [
          { q: 'Qual frase usa o Present Perfect corretamente?', opts: ['She go to London last year.', 'She has gone to London before.', 'She gone to London yesterday.', 'She was go to London.'], ans: 1 },
          { q: 'Tradução de "I have already eaten."', opts: ['Eu já comi.', 'Eu vou comer.', 'Eu estava comendo.', 'Eu comi ontem.'], ans: 0 },
          { q: 'Complete: "They ___ never tried sushi."', opts: ['is', 'was', 'have', 'did'], ans: 2 },
          { q: 'Quando usamos o Present Perfect?', opts: ['Para ações no passado com tempo definido', 'Para experiências de vida ou ações recentes', 'Apenas para o futuro', 'Para hábitos presentes'], ans: 1 },
        ]
      },
      {
        id: 'en-3-2',
        title: 'Listening: At the Airport',
        type: 'listening',
        meta: 'Compreensão · 4 exercícios · ~6 min',
        icon: 'ti-headphones',
        questions: [
          { q: '"Gate" em um aeroporto significa:', opts: ['Bagagem', 'Portão de embarque', 'Passaporte', 'Bilhete'], ans: 1 },
          { q: '"Boarding pass" é:', opts: ['Passaporte', 'Mala de mão', 'Cartão de embarque', 'Visto'], ans: 2 },
          { q: '"Where is the departure hall?" significa:', opts: ['Onde fica o banheiro?', 'Onde fica o saguão de partidas?', 'Onde fica o taxi?', 'Onde fica a saída?'], ans: 1 },
          { q: '"My flight is delayed" significa:', opts: ['Meu voo foi cancelado', 'Meu voo está atrasado', 'Meu voo chegou', 'Meu voo foi remarcado'], ans: 1 },
        ]
      }
    ],
    4: [
      {
        id: 'en-4-1',
        title: 'Future: Will & Going to',
        type: 'grammar',
        meta: 'Gramática · 4 exercícios · ~8 min',
        icon: 'ti-calendar',
        questions: [
          { q: 'Usamos "will" para:', opts: ['Planos já decididos', 'Decisões tomadas na hora', 'Ações passadas', 'Hábitos presentes'], ans: 1 },
          { q: '"I ___ visit my grandma this weekend." (plano já feito)', opts: ['will', 'am going to', 'was', 'did'], ans: 1 },
          { q: '"It\'s cloudy. It ___ rain." (previsão baseada em evidência)', opts: ['will', 'is going to', 'did', 'has'], ans: 1 },
          { q: 'Tradução de "She will be famous one day."', opts: ['Ela foi famosa um dia.', 'Ela é famosa agora.', 'Ela vai ser famosa um dia.', 'Ela estava ficando famosa.'], ans: 2 },
        ]
      }
    ],
    5: [
      {
        id: 'en-5-1',
        title: 'Vocabulary: Food & Drinks',
        type: 'vocabulary',
        meta: 'Vocabulário · 4 exercícios · ~5 min',
        icon: 'ti-salad',
        questions: [
          { q: '"Strawberry" em português é:', opts: ['Laranja', 'Morango', 'Amora', 'Cereja'], ans: 1 },
          { q: 'Como se diz "suco de laranja"?', opts: ['Apple juice', 'Orange juice', 'Lemon juice', 'Grape juice'], ans: 1 },
          { q: '"I\'m starving!" significa:', opts: ['Estou com sede', 'Estou cansado', 'Estou com muita fome', 'Estou satisfeito'], ans: 2 },
          { q: '"Can I have the bill, please?" é dito em:', opts: ['Uma loja', 'Um restaurante', 'Um hospital', 'Uma escola'], ans: 1 },
        ]
      }
    ],
    6: [
      {
        id: 'en-6-1',
        title: 'Review: Week 1',
        type: 'grammar',
        meta: 'Revisão · 4 exercícios · ~6 min',
        icon: 'ti-refresh',
        questions: [
          { q: 'Qual tempo verbal expressa experiências de vida?', opts: ['Simple Past', 'Present Perfect', 'Simple Present', 'Past Continuous'], ans: 1 },
          { q: '"She didn\'t go to the party." está no:', opts: ['Present Perfect', 'Simple Present', 'Simple Past', 'Future'], ans: 2 },
          { q: 'Qual é o plural de "child"?', opts: ['Childs', 'Children', 'Childrens', 'Childes'], ans: 1 },
          { q: '"Nevertheless" significa:', opts: ['Portanto', 'No entanto', 'Além disso', 'Por exemplo'], ans: 1 },
        ]
      }
    ]
  },
  es: {
    0: [
      {
        id: 'es-0-1',
        title: 'Saludos y presentaciones',
        type: 'vocabulary',
        meta: 'Vocabulário · 4 exercícios · ~5 min',
        icon: 'ti-vocabulary',
        questions: [
          { q: 'O que significa "¿Cómo te llamas?"', opts: ['Como você está?', 'Qual é o seu nome?', 'Onde você mora?', 'Quantos anos você tem?'], ans: 1 },
          { q: '"Me llamo Ana" significa:', opts: ['Eu chamo Ana', 'Meu nome é Ana', 'Eu conheço Ana', 'Eu sou Ana'], ans: 1 },
          { q: 'Como se diz "bom dia" em espanhol?', opts: ['Buenas noches', 'Buenas tardes', 'Buenos días', 'Buena suerte'], ans: 2 },
          { q: '"Mucho gusto" significa:', opts: ['Muito obrigado', 'Muito prazer', 'Muito bem', 'Muito longe'], ans: 1 },
        ]
      }
    ],
    1: [
      {
        id: 'es-1-1',
        title: 'Verbos regulares — AR',
        type: 'grammar',
        meta: 'Gramática · 4 exercícios · ~7 min',
        icon: 'ti-pencil',
        questions: [
          { q: 'Conjugação de "hablar" para "yo":', opts: ['hablas', 'hablo', 'habla', 'hablan'], ans: 1 },
          { q: '"Nosotros ___ mucho." (estudiar)', opts: ['estudia', 'estudias', 'estudiamos', 'estudian'], ans: 2 },
          { q: 'Qual é o infinitivo de "caminas"?', opts: ['caminando', 'caminé', 'caminar', 'caminará'], ans: 2 },
          { q: '"Ellos ___ fútbol todos los días."', opts: ['juegas', 'juega', 'juegan', 'jugamos'], ans: 2 },
        ]
      }
    ],
    2: [{ id:'es-2-1', title:'Los colores', type:'vocabulary', meta:'Vocabulário · 4 exercícios', icon:'ti-palette',
      questions:[
        {q:'"Rojo" em português é:',opts:['Azul','Verde','Vermelho','Amarelo'],ans:2},
        {q:'Como se diz "amarelo" em espanhol?',opts:['Morado','Amarillo','Naranja','Verde'],ans:1},
        {q:'"El cielo es ___." (azul)',opts:['rojo','verde','azul','negro'],ans:2},
        {q:'"Blanco" significa:',opts:['Preto','Cinza','Branco','Bege'],ans:2},
      ]}],
    3: [{ id:'es-3-1', title:'La familia', type:'vocabulary', meta:'Vocabulário · 4 exercícios', icon:'ti-users',
      questions:[
        {q:'"Hermano" em português é:',opts:['Primo','Irmão','Pai','Tio'],ans:1},
        {q:'Como se diz "avó" em espanhol?',opts:['Madre','Tía','Abuela','Prima'],ans:2},
        {q:'"Tengo dos hijos." significa:',opts:['Tenho dois irmãos','Tenho dois filhos','Tenho dois primos','Tenho dois amigos'],ans:1},
        {q:'"Mi esposo" significa:',opts:['Meu pai','Meu irmão','Meu esposo','Meu filho'],ans:2},
      ]}],
    4: [{ id:'es-4-1', title:'Los números 1–100', type:'vocabulary', meta:'Vocabulário · 4 exercícios', icon:'ti-123',
      questions:[
        {q:'Como se escreve 30 em espanhol?',opts:['Veinte','Cuarenta','Treinta','Cincuenta'],ans:2},
        {q:'"Setenta y cinco" é:',opts:['65','75','85','55'],ans:1},
        {q:'Cinquenta em espanhol é:',opts:['Cuarenta','Sesenta','Cincuenta','Setenta'],ans:2},
        {q:'"Cien" significa:',opts:['Dez','Cem','Mil','Cinquenta'],ans:1},
      ]}],
    5: [{ id:'es-5-1', title:'La comida', type:'vocabulary', meta:'Vocabulário · 4 exercícios', icon:'ti-salad',
      questions:[
        {q:'"El desayuno" é:',opts:['Almoço','Jantar','Café da manhã','Lanche'],ans:2},
        {q:'Como se diz "frango" em espanhol?',opts:['Cerdo','Pollo','Res','Pescado'],ans:1},
        {q:'"Tengo hambre." significa:',opts:['Estou com sono','Estou com fome','Estou com sede','Estou cansado'],ans:1},
        {q:'"¿Me trae la cuenta?" é pedido em:',opts:['Mercado','Restaurante','Escola','Farmácia'],ans:1},
      ]}],
    6: [{ id:'es-6-1', title:'Repaso: Semana 1', type:'grammar', meta:'Revisão · 4 exercícios', icon:'ti-refresh',
      questions:[
        {q:'"¿Cuántos años tienes?" significa:',opts:['Onde você mora?','Quantos anos você tem?','Como você está?','O que você faz?'],ans:1},
        {q:'Conjugação de "ser" para "ella":',opts:['soy','eres','es','somos'],ans:2},
        {q:'"Buenos días" é usado:',opts:['À noite','De manhã','À tarde','Qualquer hora'],ans:1},
        {q:'"Mi casa es grande." — "grande" é:',opts:['Substantivo','Verbo','Adjetivo','Advérbio'],ans:2},
      ]}],
  }
};

const TYPE_STYLES = {
  grammar:   { bg: '#ede9fe', color: '#3c1a8e', icon: 'ti-pencil' },
  vocabulary:{ bg: '#faeeda', color: '#854f0b', icon: 'ti-alphabet-latin' },
  listening: { bg: '#e1f5ee', color: '#0f6e56', icon: 'ti-headphones' },
  writing:   { bg: '#fee2e2', color: '#991b1b', icon: 'ti-writing' },
  reading:   { bg: '#eff6ff', color: '#1e40af', icon: 'ti-book' },
};

const DAY_NAMES = ['Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado','Domingo'];
const DAY_SHORT = ['seg','ter','qua','qui','sex','sáb','dom'];
