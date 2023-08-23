import './App.css';
import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm'; // ExpenseForm을 해당 경로에서 가져옴!
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';

//// ------------- State ------------- ////
const App = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, charge: '렌트비', amount: 1600 },
    { id: 2, charge: '교통비', amount: 1200 },
    { id: 3, charge: '식비', amount: 15000 },
  ]);
  const [charge, setCharge] = useState('');
  const [amount, setAmount] = useState(0);
  const [alert, setAlert] = useState({ show: false, type: '', text: '' });
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState('');
  const clearItems = () => {
    setExpenses([]);
  }

  //// ------------- 지출항목 input 받아오기 ------------- ////
  const handleCharge = (event) => {
    setCharge(event.target.value);
  };

  //// ------------- 비용 input 받아오기 ------------- ////
  const handleAmount = (event) => {
    setAmount(event.target.valueAsNumber); // Num 형변환
  };

  //// ------------- 등록기능 ------------- ////
  const handleSubmit = (event) => {
    event.preventDefault(); // 페이지 refresh 막음.

    if (charge !== '' && amount !== 0) {
      if (edit) {
        const editedExpense = expenses.find((item) => item.id === id);
        editedExpense.charge = charge;
        editedExpense.amount = amount;

        handleAlert({ type: 'success', text: '수정 완료!' });
        setEdit(false)
      } else {
        const newExpense = {
          id: crypto.randomUUID(), // 난수생성
          charge,
          amount,
        };

        // state update 할 때는 항상 불변성을 지켜줘야 함.
        // 불변성을 지킨다는 말은 이전 데이터를 건드리지 않고, 새로운 값을 추가한다는 뜻.
        setExpenses([newExpense, ...expenses]);
        handleAlert({ type: 'success', text: '등록 완료!' });
      }
      setCharge('');
      setAmount(0);
      
      // expenses state에 새로운 객체 만들어서 추가해주기. state update
    } else {
      console.log('빈값이 있음!');
      handleAlert({ type: 'danger', text: '항목을 모두 작성해주세요.' });
    }
  };

  //// ------------- Alert 기능 ------------- ////
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type: type, text: text });
    setTimeout(
      () =>
        setAlert({
          show: false,
          type: '',
          text: '',
        }),
      4000
    );
  };

  //// ------------- 수정 아이콘 기능 ------------- ////
  const handleEdit = (id) => {
    const expense = expenses.find((item) => item.id === id);
    const { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  //// ------------- 삭제 아이콘 기능 ------------- ////
  const handleDelete = (id) => {
    const newExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(newExpenses);
  };

  //// ------------- 페이지 ------------- ////
  return (
    <main className="main-container">
      {alert.show ? <Alert type={alert.type} text={alert.text} /> : null}
      <h1>예산 계산기</h1>

      <div style={{ width: '100%', backgroundColor: 'white', padding: '1rem' }}>
        {/* Expense Form */}
        <ExpenseForm
          charge={charge}
          handleCharge={handleCharge}
          amount={amount}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
      </div>
      <div style={{ width: '100%', backgroundColor: 'white', padding: '1rem' }}>
        {/* Expense List */}
        <ExpenseList 
          expenses={expenses} 
          handleDelete={handleDelete} 
          handleEdit={handleEdit} 
          clearItems={clearItems} 
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'end', marginTop: '1rem' }}>
        <p style={{ fontSize: '2rem' }}>
          총 지출 :
          <span>
            {expenses.reduce((acc, curr) => {
              // reduce로 누적계산 수행.
              return acc + curr.amount;
            }, 0)}
            원
          </span>
        </p>
      </div>
    </main>
  );
};

export default App;
