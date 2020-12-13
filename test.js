const buildQuestion = (state, rerender) => {
    const { currentQuestionId, questions } = state;
    const currentQuestionData = questions[currentQuestionId];

    /*создание формы*/
    const form = document.createElement("form");

    const per = document.createElement("hr");

    /*создание номера вопроса*/
    const header = document.createElement("h3");
    header.className = "number";
    header.innerHTML = `Вопрос ${currentQuestionId + 1}<br/>`;

    const pic = document.createElement("IMG");
    pic.src = `img/rastenie-${currentQuestionId + 1}.jpg`;
    pic.style.width='40%';

    /*создание вопроса*/
    const question = document.createElement("p");
    question.className = "question";
    question.textContent = currentQuestionData.question;
    question.appendChild(per);
    question.appendChild(pic);

    /*создание вариантов ответа*/
    const answerOptions = document.createElement("div");
    /*проходимся по вариантам*/
    currentQuestionData.options.forEach((option) => {
        /*один из вариантов*/
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.value = option;


        /*подпись*/
        const label = document.createElement("label");
        label.className = "choice-text";
        label.appendChild(radio);

        /*добавление label в html документ*/
        answerOptions.appendChild(label);
        radio.insertAdjacentHTML("afterend", `   ${option}<br>`);
    });

    /*создание кнопки*/
    const submitBtn = document.createElement("input");
    submitBtn.className = "btn";
    submitBtn.type = "submit";
    submitBtn.value = "Продолжить";

    /*действует при нажатии на кнопку*/
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        /*получение ответа*/
        const answer = new FormData(e.target).get("answer");
        /*добавление ответа*/
        state.answers.push(answer);
        state.currentQuestionId += 1;

        /*если номер больше или равен длины доступных вопрос, то присваиваем ключ результата*/
        if (state.currentQuestionId >= state.questions.length) {
            state.mode = "result";
        }

        rerender(state);
    });

    form.appendChild(header);
    form.appendChild(question);
    form.appendChild(answerOptions);
    form.appendChild(submitBtn);

    return form;
};

/*результат*/
const buildResult = (state) => {
    const { results, answers } = state;

    const result = results.reduce(
        (acc, { name, options }) => {
            /*считаем все совпадения*/
            const coincidence = answers.filter((item) => options.includes(item)).length;
            return coincidence >= acc.count ? { name, count: coincidence } : acc;
        },
        { name: state.default, count: 0 }
    );

    const resultPic = document.createElement("IMG");
    resultPic.src = `img/${result.name}.jpg`;
    resultPic.style.width='40%';
    resultPic.style.width='60%';

    /*вывод результата*/
    const resultElement = document.createElement("div");
    resultElement.classList.add("result-form");
    resultElement.innerHTML = `Поздравляем, вы ${result.name}!<br/><br/>`;
    resultElement.appendChild(resultPic);

    return resultElement;
};

const render = (element) => (state) => {
    /*изначально результат пуст*/
    element.innerHTML = "";

    switch (state.mode) {
        /*если ключ равен вопросу, то вызываем функцию построения вопроса*/
        case "question": {
            const questionElement = buildQuestion(state, render(element));
            element.appendChild(questionElement);
            break;
        }
        /*если ключ равен результату, то вызываем функция построения результата*/
        case "result": {
            const resultElement = buildResult(state);
            element.appendChild(resultElement);
            break;
        }
        /*неизвестый ключ*/
        default: {
            throw new Error(`Unknown mode: ${state.mode}`);
        }
    }
};


const initialize = (name) => {
    /*инициализация элементов*/
    const state = {
        currentQuestionId: 0,
        questions: config[name].questions,
        results: config[name].results,
        answers: [],
        default: config.default,
        mode: "question"
    };

    /*поиск элемента, в котором будет показан результат, и вызов основной функции*/
    const root = document.getElementById("result");
    render(root)(state);
};


/*ДАННЫЕ*/
const config = {
    rastenie: {
        questions: [
            {
                question: "Если бы вас попросили охарактеризовать себя одним словом:",
                options: [
                    "Гибкий",
                    "Выносливый",
                    "Настойчивый",
                    "Капризный",
                    "Вспыльчивый"
                ]
            },
            {
                question: "Больше всего на свете вы любите:",
                options: [
                    "Экстремальные развлечения",
                    "Те моменты, когда вас наконец оставляют в покое",
                    "Путешествовать",
                    "Привлекать внимание других",
                    "Наблюдать за людьми и узнавать о них что-то новое"
                ]
            },
            {
                question: "В детстве вы мечтали стать:",
                options: [
                    "Актером. Мне хотелось играть на сцене и в кино",
                    "Космонавтом, чтобы улететь как можно дальше от дома и все там исследовать",
                    "Шеф-поваром, чтобы готовить самую вкусную еду",
                    "Архитектором. Мне всегда нравились красивые и необычные сооружения",
                    "Ученым-биологом. Я хотел изучать природу"
                ]
            },
            {
                question: "Главное в жизни - это:",
                options: [
                    "Умение приспособиться к ситуации",
                    "Порядок",
                    "Целеустремленность",
                    "Знания о том, как защититься от опасности",
                    "Опыт и эмоции, которые она дает"
                ]
            },
            {
                question: "Вы могли бы бесконечно любоваться:",
                options: [
                    "Людьми и товарами на шумном восточном базаре",
                    "Уютными парижскими улочками",
                    "Пустынной поверхностью Марса",
                    "Неторопливым течением реки",
                    "Причудливыми обитателями тропического леса"
                ]
            },
            {
                question: "И последний вопрос. Растения нужны нам прежде всего:",
                options: [
                    "Как украшение нашего мира",
                    "Как источник новых инженерных решений",
                    "В качестве специй и приправ",
                    "Для творческого вдохновения",
                    "Как интересный научный объект"
                ]
            }
        ],
        results: [
            {
                name: "Кактус",
                options: [
                    "Выносливый",
                    "Экстремальные развлечения",
                    "Ученым-биологом. Я хотел изучать природу",
                    "Умение приспособиться к ситуации",
                    "Пустынной поверхностью Марса",
                    "Как украшение нашего мира"
                ]
            },
            {
                name: "Спатифиллум",
                options: [
                    "Капризный",
                    "Наблюдать за людьми и узнавать о них что-то новое",
                    "Актером. Мне хотелось играть на сцене и в кино",
                    "Порядок",
                    "Опыт и эмоции, которые она дает",
                    "Как интересный научный объект"
                ]
            },
            {
                name: "Фиалка",
                options: [
                    "Гибкий",
                    "Привлекать внимание других",
                    "Актером. Мне хотелось играть на сцене и в кино",
                    "Целеустремленность",
                    "Неторопливым течением реки",
                    "Для творческого вдохновения"
                ]
            },
            {
                name: "Орхидея",
                options: [
                    "Настойчивый",
                    "Наблюдать за людьми и узнавать о них что-то новое",
                    "Космонавтом, чтобы улететь как можно дальше от дома и все там исследовать",
                    "Порядок",
                    "Уютными парижскими улочками",
                    "Как украшение нашего мира"
                ]
            },
            {
                name: "Розмарин",
                options: [
                    "Гибкий",
                    "Те моменты, когда вас наконец оставляют в покое",
                    "Архитектором. Мне всегда нравились красивые и необычные сооружения",
                    "Опыт и эмоции, которые она дает",
                    "Людьми и товарами на шумном восточном базаре",
                    "В качестве специй и приправ"
                ]
            },
            {
                name: "Венерина мухоловка",
                options: [
                    "Вспыльчивый",
                    "Те моменты, когда вас наконец оставляют в покое",
                    "Ученым-биологом. Я хотел изучать природу",
                    "Знания о том, как защититься от опасности",
                    "Пустынной поверхностью Марса",
                    "Как источник новых инженерных решений"
                ]
            },
            {
                name: "Ленивый плющ",
                options: [
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ]
            }
        ]
    }
};

// slider communication
const setProperty = (property, value) => document.body.style.setProperty(property, value)
// fanciness on/off
const toggleTheFancy = () => element.classList.toggle

setProperty('--demo-width', 70)
