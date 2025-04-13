const { useState, useRef } = React;

const SurveyForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const sectionsRef = useRef({});

  const scrollToSection = (key) => {
    if (sectionsRef.current[key]) {
      sectionsRef.current[key].scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: "Новый вопрос",
      options: type === "radio" || type === "checkbox" ? ["Ответ 1", "Ответ 2"] : [],
      required: false,
      inputType: type === "text" ? "text" : undefined,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setShowTypeSelector(false);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddOption = (qid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleDeleteOption = (qid, idx) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.filter((_, i) => i !== idx) }
          : q
      )
    );
  };

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

  const handleChangeQuestionType = (qid, type) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qid ? { ...q, type } : q))
    );
  };

  const handleToggleRequired = (qid) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, required: !q.required } : q
      )
    );
  };

  const handleChangeInputType = (qid, type) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qid ? { ...q, inputType: type } : q
      )
    );
  };

  const handlePublish = () => {
    alert("Опрос опубликован!");
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="top-bar">
          <h2 className="text-xl font-bold">Создание опроса</h2>
          <button className="button" onClick={handlePublish}>Опубликовать</button>
        </div>

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

        <div ref={(el) => (sectionsRef.current["Описание"] = el)}>
          <label className="font-medium">Описание</label>
          <textarea
            className="input-field"
            placeholder="Введите описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div ref={(el) => (sectionsRef.current["Доступен с"] = el)}>
          <label className="font-medium">Доступен с</label>
          <input type="date" className="input-field" />
        </div>

        <div ref={(el) => (sectionsRef.current["Доступен до"] = el)}>
          <label className="font-medium">Доступен до</label>
          <input type="date" className="input-field" />
        </div>

        {questions.map((q, i) => (
          <div
            key={q.id}
            className="question-box"
            ref={(el) => (sectionsRef.current[q.question] = el)}
          >
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                className="input-field"
                value={q.question}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[i].question = e.target.value;
                  setQuestions(updated);
                }}
              />
              {(q.type === "radio" || q.type === "checkbox") && (
                <select
                  className="input-field w-40"
                  value={q.type}
                  onChange={(e) => handleChangeQuestionType(q.id, e.target.value)}
                >
                  <option value="radio">Один из списка</option>
                  <option value="checkbox">Несколько из списка</option>
                </select>
              )}
            </div>

            {(q.type === "radio" || q.type === "checkbox") &&
              q.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input type={q.type} disabled />
                  <input
                    type="text"
                    className="flex-1 input-field"
                    value={opt}
                    onChange={(e) => handleChangeOption(q.id, idx, e.target.value)}
                  />
                  <button onClick={() => handleDeleteOption(q.id, idx)}>🗑</button>
                </div>
              ))}

            {(q.type === "radio" || q.type === "checkbox") && (
              <button className="text-blue-600 mb-2" onClick={() => handleAddOption(q.id)}>
                + Добавить вариант ответа
              </button>
            )}

            {q.type === "text" && (
              <div className="mb-4">
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

            {q.type === "nps" && (
              <div className="flex gap-2 mt-2">
                {[...Array(10)].map((_, idx) => (
                  <button key={idx} className="border rounded p-2 w-10">
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-4 items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={q.required}
                  onChange={() => handleToggleRequired(q.id)}
                />
                Обязательный вопрос
              </label>
              <button className="text-red-500" onClick={() => handleDeleteQuestion(q.id)}>
                🗑 Удалить вопрос
              </button>
            </div>
          </div>
        ))}

        <div className="bottom-buttons">
          {showTypeSelector ? (
            <div className="flex gap-4 flex-wrap">
              <button className="button" onClick={() => handleAddQuestion("radio")}>Один из списка</button>
              <button className="button" onClick={() => handleAddQuestion("checkbox")}>Несколько из списка</button>
              <button className="button" onClick={() => handleAddQuestion("text")}>Свой вариант</button>
              <button className="button" onClick={() => handleAddQuestion("nps")}>Шкала NPS</button>
            </div>
          ) : (
            <button className="button" onClick={() => setShowTypeSelector(true)}>+ Добавить вопрос</button>
          )}
          <button className="button" onClick={handlePublish}>Опубликовать</button>
        </div>
      </div>

      {/* Навигация */}
      <div className="sidebar">
        <div className="navigation">
          <h3 className="text-lg font-bold mb-2">НАВИГАЦИЯ</h3>
          <ul>
            <li onClick={() => scrollToSection("Название")}>Название</li>
            <li onClick={() => scrollToSection("Описание")}>Описание</li>
            <li onClick={() => scrollToSection("Доступен с")}>Доступен с</li>
            <li onClick={() => scrollToSection("Доступен до")}>Доступен до</li>
            {questions.map((q) => (
              <li key={q.id} onClick={() => scrollToSection(q.question)}>
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
