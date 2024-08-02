import './App.css';
import Chatbot from '../src/components/chatbot/Chatbot.jsx';
import ChatbotButton from './components/chatBotButton/index.jsx';
import Layout from './components/layout/index.jsx';
import MyWidgetElement from './class.js';

function App() {
  return (
    <Layout>
      {/* <MyWidgetElement/> */}
      <ChatbotButton/>
    </Layout>
  );
}

export default App;
