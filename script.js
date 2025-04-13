const { useState, useRef } = React;

const SurveyForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      type: "radio",
      question: "Булочки с чем?",
      options: ["Ответ 1", "Ответ 2", "Свой вариант ответа"],
      required: false,
    }
  ]);

  const sectionsRef = useRef({});

  const scrollToSection = (key) => {
    if (sectionsRef.current[key]) {
        sectionsRef.current[key].scrollIntoView({ behavior: "smooth" });
      };
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        type: "radio",
        question: "Новый вопрос",
        options: ["Ответ 1", "Ответ 2"],
        required: false,
      }
    ]);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleAddOption = (qid) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleDeleteOption = (qid, idx) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid
          ? { ...q, options: q.options.filter((_, i) => i !== idx) }
          : q
      )
    );
  };

  const handleChangeOption = (qid, idx, value) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === idx ? value : opt))
            }
          : q
      )
    );
  };

  const handleChangeQuestionType = (qid, type) => {
    setQuestions(prev =>
      prev.map(q => (q.id === qid ? { ...q, type } : q))
    );
  };

  const handleToggleRequired = (qid) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === qid ? { ...q, required: !q.required } : q
      )
    );
  };

  const handlePublish = () => {
    alert("Опрос опубликован!");
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="top-bar" ref={el => (sectionsRef.current["Создание опроса"] = el)}>
          <h2 className="text-xl font-bold">Создание опроса</h2>
          <button className="button" onClick={handlePublish}>Опубликовать</button>
        </div>

        <div ref={el => (sectionsRef.current["Название"] = el)}>
          <label className="font-medium">Название *</label>
          <input
            type="text"
            className="input-field"
            placeholder="Введите название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div ref={el => (sectionsRef.current["Описание"] = el)}>
          <label className="font-medium">Описание</label>
          <textarea
            className="input-field"
            placeholder="Введите описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div ref={el => (sectionsRef.current["Доступен с"] = el)}>
          <label className="font-medium">Доступен с</label>
          <input type="date" className="input-field" />
        </div>

        <div ref={el => (sectionsRef.current["Доступен до"] = el)}>
          <label className="font-medium">Доступен до</label>
          <input type="date" className="input-field" />
        </div>

        {questions.map((q, index) => (
          <div key={q.id} className="question-box" ref={el => (sectionsRef.current[q.question] = el)}>
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                className="input-field"
                value={q.question}
                onChange={(e) =>
                  setQuestions(prev =>
                    prev.map(item =>
                      item.id === q.id ? { ...item, question: e.target.value } : item
                    )
                  )
                }
              />
              <select
                className="input-field w-40"
                value={q.type}
                onChange={(e) => handleChangeQuestionType(q.id, e.target.value)}
              >
                <option value="radio">Один из списка</option>
                <option value="checkbox">Несколько из списка</option>
              </select>
            </div>

            {q.options.map((opt, idx) => (
              <div key={idx} className="flex items-center mb-2 gap-2">
                <input type={q.type} disabled />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleChangeOption(q.id, idx, e.target.value)}
                  className="flex-1 input-field"
                />
                <button onClick={() => handleDeleteOption(q.id, idx)}>🗑</button>
              </div>
            ))}

            <button className="text-blue-600 mb-2" onClick={() => handleAddOption(q.id)}>+ Добавить вариант ответа</button>

            <div className="flex justify-between mt-2 items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={q.required}
                  onChange={() => handleToggleRequired(q.id)}
                />
                Обязательный вопрос
              </label>
              <button className="text-red-500" onClick={() => handleDeleteQuestion(q.id)}>🗑 Удалить вопрос</button>
            </div>
          </div>
        ))}

        <div className="bottom-buttons">
          <button className="button" onClick={handleAddQuestion}>+ Добавить вопрос</button>
          <button className="button" onClick={handlePublish}>Опубликовать</button>
        </div>
      </div>

      <div className="sidebar">
        <div className="navigation">
          <h3>НАВИГАЦИЯ</h3>
          <ul>
            {["Название", "Описание", "Доступен с", "Доступен до", ...questions.map(q => q.question)].map((item, i) => (
              <li key={i} onClick={() => scrollToSection(item)}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<SurveyForm />);
