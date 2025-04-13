const { useState, useRef } = React;

const SurveyForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const sectionsRef = useRef({});

  // Прокрутка к нужной секции
  const scrollToSection = (key) => {
    // Убрали optional chaining, чтобы старая Babel не ругалась
    if (sectionsRef.current[key]) {
      sectionsRef.current[key].scrollIntoView({ behavior: "smooth" });
    }
  };

  // Добавление вопроса (4 типа)
  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: "Новый вопрос",
      options: (type === "radio" || type === "checkbox") ? ["Ответ 1", "Ответ 2"] : [],
      required: false,
      inputType: type === "text" ? "text" : undefined,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setShowTypeSelector(false);
  };

  // Удаление вопроса целиком
  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Добавление варианта ответа
  const handleAddOption = (qid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  // Удаление варианта ответа
  const handleDeleteOption = (qid, idx) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.filter((_, i) => i !== idx) }
          : q
      )
    );
  };

  // Изменение текста варианта
  const handleChangeOption = (qid, idx, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === idx ? value : opt)),
            }
          : q
      )
    );
  };

  // Смена типа radio/checkbox
  const handleChangeQuestionType = (qid, newType) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qid ? { ...q, type: newType } : q))
    );
  };

  // Переключение «Обязательный вопрос»
  const handleToggleRequired = (qid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, required: !q.required } : q
      )
    );
  };

  // Для «Свой вариант» (text/number)
  const handleChangeInputType = (qid, newType) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, inputType: newType } : q
      )
    );
  };

  const handlePublish = () => {
    alert("Опрос опубликован!");
  };

  return (
    <div className="container">
      {/* Левая часть: основное содержимое */}
      <div className="main-content">
        <div className="top-bar">
          <h2 className="text-xl font-bold">Создание опроса</h2>
          <button className="button" onClick={handlePublish}>Опубликовать</button>
        </div>

        {/* Название */}
        <div ref={(el) => (sectionsRef.current["Название"] = el)}>
          <label className="font-medium">Название *</label>
          <input
            type="text"
            className="input-field"
            placeholder="Введите название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Описание */}
        <div ref={(el) => (sectionsRef.current["Описание"] = el)}>
          <label className="font-medium">Описание</label>
          <textarea
            className="input-field"
            placeholder="Введите описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Даты */}
        <div ref={(el) => (sectionsRef.current["Доступен с"] = el)}>
          <label className="font-medium">Доступен с</label>
          <input type="date" className="input-field" />
        </div>
        <div ref={(el) => (sectionsRef.current["Доступен до"] = el)}>
          <label className="font-medium">Доступен до</label>
          <input type="date" className="input-field" />
        </div>

        {/* Список вопросов */}
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="question-box"
            ref={(el) => (sectionsRef.current[q.question] = el)}
          >
            {/* Шапка вопроса */}
            <div className="question-header">
              <div className="question-title">
                <input
                  type="text"
                  className="w-full bg-transparent border-none outline-none font-medium"
                  value={q.question}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[i].question = e.target.value;
                    setQuestions(updated);
                  }}
                />
              </div>

              {(q.type === "radio" || q.type === "checkbox") && (
                <div className="question-type">
                  <select
                    value={q.type}
                    onChange={(e) => handleChangeQuestionType(q.id, e.target.value)}
                  >
                    <option value="radio">Один из списка</option>
                    <option value="checkbox">Несколько из списка</option>
                  </select>
                </div>
              )}
            </div>

            {/* radio / checkbox */}
            {(q.type === "radio" || q.type === "checkbox") && (
              <div>
                <div className="options-list">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="option-row">
                      <div className="option-left">
                        <input type={q.type} disabled />
                        <input
                          type="text"
                          className="input-field"
                          style={{ width: "200px" }}
                          value={opt}
                          onChange={(e) => handleChangeOption(q.id, idx, e.target.value)}
                        />
                      </div>
                      <div className="option-actions">
                        <span className="icon-btn" onClick={() => handleAddOption(q.id)}>+</span>
                        <span className="icon-btn" onClick={() => handleDeleteOption(q.id, idx)}>
                          🗑
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* «Добавить вариант» ссылкой */}
                <div className="add-option" onClick={() => handleAddOption(q.id)}>
                  Добавить вариант
                </div>
              </div>
            )}

            {/* text */}
            {q.type === "text" && (
              <div className="mb-4 mt-2">
                <label className="mr-2">Тип ввода:</label>
                <select
                  className="input-field w-40"
                  value={q.inputType}
                  onChange={(e) => handleChangeInputType(q.id, e.target.value)}
                >
                  <option value="text">Текст</option>
                  <option value="number">Число</option>
                </select>
              </div>
            )}

            {/* nps */}
            {q.type === "nps" && (
              <div className="flex gap-2 mt-2">
                {[...Array(10)].map((_, idx) => (
                  <button key={idx} className="border rounded p-2 w-10">
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Низ вопроса */}
            <div className="flex justify-between mt-4 items-center">
              <label className="flex items-center gap-2">
                <span>Обязательный вопрос</span>
                <input
                  type="checkbox"
                  checked={q.required}
                  onChange={() => handleToggleRequired(q.id)}
                />
              </label>
              <button
                className="text-red-500"
                onClick={() => handleDeleteQuestion(q.id)}
              >
                🗑 Удалить вопрос
              </button>
            </div>
          </div>
        ))}

        {/* Блок снизу: «Добавить вопрос» / «Опубликовать» */}
        <div className="bottom-buttons">
          {showTypeSelector ? (
            <div className="flex gap-4 flex-wrap">
              <button className="button" onClick={() => handleAddQuestion("radio")}>Один из списка</button>
              <button className="button" onClick={() => handleAddQuestion("checkbox")}>Несколько из списка</button>
              <button className="button" onClick={() => handleAddQuestion("text")}>Свой вариант</button>
              <button className="button" onClick={() => handleAddQuestion("nps")}>Шкала NPS</button>
            </div>
          ) : (
            <button className="button" onClick={() => setShowTypeSelector(true)}>
              + Добавить вопрос
            </button>
          )}
          <button className="button" onClick={handlePublish}>
            Опубликовать
          </button>
        </div>
      </div>

      {/* Правая часть: навигация */}
      <div className="sidebar">
        <div className="navigation">
          <h3 className="text-lg font-bold mb-2">НАВИГАЦИЯ</h3>
          <ul>
            <li onClick={() => scrollToSection("Название")}>Название</li>
            <li onClick={() => scrollToSection("Описание")}>Описание</li>
            <li onClick={() => scrollToSection("Доступен с")}>Доступен с</li>
            <li onClick={() => scrollToSection("Доступен до")}>Доступен до</li>
            {questions.map((q) => (
              <li
                key={q.id}
                onClick={() => scrollToSection(q.question)}
              >
                {q.question}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<SurveyForm />);
