import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Widget } from "../../assets";
import "./style.css";
import ChatHeader from "./components/ChatHeader";
import ChatbotContent from "./components/ChatbotContent";
import { useVisitorId } from "../../hooks/useVisitorId";
import { createSession, getSessions } from "../../API/api";
import MessagesSession from "./components/MessagesSession";
import InputField from "./components/InputField";
import { formatTime } from "../../utils/constant";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sendData, setSendData] = useState({});
  const [chat, setChat] = useState(true);
  const [isFormActive, setIsFormActive] = useState(false);
  const [goBackForm, setGoBackForm] = useState(false);
  const [values, setValues] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
  });
  const [touched, setTouched] = useState({
    userName: false,
    email: false,
    phoneNumber: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [messagesSession, setMessagesSession] = useState(false);
  const [chatArray, setChatArray] = useState([
    {
      id: "66797b9ed072397744561a2a",
      type: "user",
      content: "hello",
      created_on: "24th June 2024 . 6:58 PM",
    },
    {
      id: "66797b9ed072397744561a2a",
      type: "bot",
      content:
        "Hello! How can I assist you with information about Kodexo Labs today? 😊\n\nFeel free to ask more about Kodexo Labs, or visit our website for further details.",
      created_on: "24th June 2024 . 6:58 PM",
    },
    {
      id: "66797bb3d072397744561a2b",
      type: "user",
      content: "what is kodexo ?\n",
      created_on: "24th June 2024 . 6:59 PM",
    },
    {
      id: "66797bb3d072397744561a2b",
      type: "bot",
      content:
        "Kodexo Labs is an AI software development company based in the USA that specializes in cutting-edge AI software solutions. The company transforms business challenges into intuitive solutions by staying at the forefront of AI advancements. With a dedicated team of tech experts, Kodexo Labs offers services in Generative AI, AI and Machine Learning, Data Engineering, Software Consulting, Staff Augmentation, and Custom Product Development. They focus on delivering beyond expectations and have a systematic development approach to meet the specific needs of their clients.\n\nHow may I assist you more about Kodexo Labs? For more details, contact our website.",
      created_on: "24th June 2024 . 6:59 PM",
    },
    {
      id: "667992e9c8b7a426c82095c2",
      type: "user",
      content: "what is meat n bone ?\n\\",
      created_on: "24th June 2024 . 8:38 PM",
    },
    {
      id: "667992e9c8b7a426c82095c2",
      type: "bot",
      content:
        "Meat N' Bone is a premium online butcher shop that offers over 400 best-in-class cuts and products, including beef, poultry, pork, lamb, game, seafood, and charcuterie. They deliver nationwide in the US, including Hawaii and Puerto Rico, with options for free shipping and Saturday delivery in most areas. Meat N' Bone prides itself on combining technology, statistics, and high sourcing standards to provide quality meat. They also offer a range of services like catering, custom charcuterie boards, and a rewards program. Additionally, they are one of the largest suppliers of Wagyu steaks in the US and are involved in various promotional activities, including sponsoring a NASCAR car.\n\nFeel free to ask more about Kodexo Labs, or visit our website for further details.",
      created_on: "24th June 2024 . 8:38 PM",
    },
    {
      id: "66799350c8b7a426c82095c3",
      type: "user",
      content: "what they do",
      created_on: "24th June 2024 . 8:39 PM",
    },
    {
      id: "66799350c8b7a426c82095c3",
      type: "bot",
      content:
        "Kodexo Labs is an AI software development company based in the USA that specializes in transforming business challenges into intuitive solutions through cutting-edge AI advancements. Here's a summary of their services:\n\n1. **Generative AI**: Unlocking the creative power of AI to generate dynamic content that redefines engagement. \n\n2. **AI and Machine Learning**: Providing insights from data to uncover patterns, make data-driven decisions, and automate processes for enhanced efficiency. This includes services like predictive analytics and image recognition.\n\n3. **Data Engineering**: Structuring, integrating, and optimizing data pipelines to make data accessible and actionable for strategic growth.\n\n4. **Software Consulting**: Offering expert guidance to navigate the complex technology landscape, make informed decisions, and maximize tech investments.\n\n5. **Staff Augmentation**: Providing flexibility to quickly scale technical workforce for both short-term projects and long-term initiatives.\n\n6. **Custom Product Development**: Delivering customized software solutions tailored to meet specific business needs, from requirement assessment to testing and quality assurance.\n\nKodexo Labs also has experience in developing specialized applications in various industries, including EdTech, Automotive, Healthcare, Real Estate, FinTech, and On-Demand Apps.\n\nHow can I help you further with information about Kodexo Labs? Check our website for more details.",
      created_on: "24th June 2024 . 8:39 PM",
    },
    {
      id: "66799372c8b7a426c82095c4",
      type: "user",
      content: "no i mean what meat n bone do ?\n",
      created_on: "24th June 2024 . 8:40 PM",
    },
    {
      id: "66799372c8b7a426c82095c4",
      type: "bot",
      content:
        "Meat N' Bone is a premium online butcher shop that offers a wide range of high-quality meat products and services. Here's what they do:\n\n1. **Product Offering**: They provide over 400 best-in-class cuts and products, including beef, poultry, pork, lamb, game, seafood, charcuterie, and cheese. They also offer sides, beer, wine, sake, and Japanese knives.\n\n2. **Nationwide Delivery**: They deliver everywhere in the US, including Hawaii and Puerto Rico, with options for free shipping and Saturday delivery in most areas.\n\n3. **Specialty Products**: They are one of the largest suppliers of Wagyu steaks in the US, working with high-quality American, Australian, and Japanese Wagyu programs.\n\n4. **Custom Services**: They offer custom charcuterie boards that can be assembled for local delivery or shipped deconstructed with assembly instructions. They also provide catering services.\n\n5. **Technology and Standards**: They mix technology, statistics, and high sourcing standards to ensure quality and efficiency in their operations.\n\n6. **Crowdfunding and Expansion**: They are considering a crowdfunding campaign to scale further, already operating 5 boutiques and having shipped over 250,000 orders nationwide.\n\n7. **Community Engagement**: They have a Facebook group called \"The Butcher's Den\" for customers, VIPs, and friends to share recipes, ideas, and feedback.\n\n8. **Rewards Program**: They offer a rewards program where customers can earn points on every purchase and for referring friends.\n\n9. **Promotions and Sponsorships**: They are involved in promotional activities, such as sponsoring Kaz Grala's Car #15 in the 2024 NASCAR's Cup Series.\n\nIs there anything else you need to know about Kodexo Labs? Visit our website for more information.",
      created_on: "24th June 2024 . 8:40 PM",
    },
  ]);

  const inputRef = useRef();
  const maxLength = 100;
  const [limit, setLimit] = useState(false);
  const [rows, setRows] = useState(1);
  const systemId = useVisitorId();
  const [text, setText] = useState("hello");
  const sessionCreated = formatTime();

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (!text) {
      if (inputValue?.length <= maxLength) {
        setMessages(inputValue);
        setLimit(false);
      } else {
        setLimit(true);
      }
    } else {
      setMessages(inputValue);
    }
    updateRows(e.target);
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text");
    const existingData = messages || "";
    const newText = existingData + pasteData;
    setLimit(false);
    if (hasLineBreaks(pasteData)) {
      setRows(3);
    }
    if (newText.length > maxLength) {
      event.preventDefault();
      const truncatedText = newText.substring(0, maxLength);
      setMessages(truncatedText);
      setLimit(true);
    } else {
      updateRows({ value: newText });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmitMessage(event);
    }
  };

  const handleSubmitMessage = (event) => {
    sendMessage(event);
    setRows(1);
    setLimit(false);
  };

  function hasLineBreaks(text) {
    const lineBreakPattern = /\r?\n/;
    return lineBreakPattern.test(text);
  }

  const updateRows = (textarea) => {
    if (textarea.value.length === 0) {
      setRows(1);
      return;
    }
    textarea.style.height = "auto";
    const rowHeight = parseInt(
      window.getComputedStyle(textarea).lineHeight,
      10
    );
    const newRows = Math.floor(textarea.scrollHeight / rowHeight);
    setRows(newRows <= 3 ? newRows : 3);
    textarea.style.height = "";
  };
  const sendMessage = (e) => {
    console.log(e.target.value);
    // e.preventDefault();
    // if (!messages?.trim()) {
    //   Notification("The input field is empty", "info");
    //   return;
    // }
    // setChatLoad(true);
    // const currentTime = formatTime();
    // setChatArray((prevChat) => [
    //   ...prevChat,
    //   {
    //     type: "user",
    //     content: message,
    //     // email: userData?.email,
    //     created_on: currentTime,
    //   },
    // ]);
    // if (message !== "") {
    //   const sanitizedMessage = message
    //     .replace(/</g, "&lt;")
    //     .replace(/>/g, "&gt;");

    //   socket.emit("chat_message", {
    //     type: "user",
    //     content: sanitizedMessage,
    //     // email: userData?.email,
    //     session_id: sessionId,
    //     is_joined: admin,
    //     agent_response: "",
    //     created_on: currentTime,
    //   });
    //   setMessage("");
    //   scrollToEnd();
    // } else {
    //   Notification("The input field is empty", "info");
    //   setChatLoad(false);
    // }
  };

  const startSession = () => {
    const data = {
      system_id: systemId,
      created_on: sessionCreated,
      user_id: "6669895769c6544ea16e04cc",
    };
    // const result= createSession("POST",data)
    setIsFormActive(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    // setMessagesSession(true); this state redirects us to the chat screen no matter tha input's are filled or not.
    // setIsFormActive(false); this state make the form go away no matter tha input's are filled or not.

    if (!validate()) {
      setMessagesSession(true);
      console.log("Form submitted", values);
      console.log(errors);
    } else {
      console.log("...", errors);

      console.log("Validation failed");
    }
  };

  const validate = () => {
    const newErrors = { userName: "", email: "" };
    if (!values.userName) {
      newErrors.userName = "Name is required";
    }
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Email is invalid";
    }
    console.log("123-->", newErrors);
    setErrors(newErrors);
    // setTouched(newErrors);
    return newErrors.userName && newErrors.email;
  };

  const handleChange = (field) => (event) => {
    console.log("handle change");
    setValues({ ...values, [field]: event.target.value });

    setTouched({ ...touched, [field]: true });
    if (!submitAttempted) {
      setSubmitAttempted(true); // Set submitAttempted to true on first interaction with any field
    }
  };

  const goBack = () => {
    console.log("go back");
    setIsFormActive(false);
    setGoBackForm(true);
  };
  useEffect(() => {
    validate(); // Run checkError whenever values or touched state changes
  }, [values, touched]);
  useEffect(() => {
    // const result = getSessions("GET", systemId);

    const socket = io("d116w9xjnkxxep.cloudfront.net", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("chat_message", sendData);
      console.log("WebSocket connected");
    });

    socket.on("connect_error", (error) => {
      console.log("WebSocket connection error:", error);
    });

    socket.on("done", (msg) => {
      console.log("Received 'done' event:", msg);
      if (msg?.chat_completed && msg?.sentence) {
        console.log(msg?.chat_completed, msg?.sentence);
        if (!msg?.fine_tuning) {
          console.log("msg", msg);
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: "bot", content: msg.sentence },
          ]);
        }
      }
    });

    socket.on("response", (msg) => {
      console.log("Received 'response' event:", msg);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", content: msg },
      ]);
    });

    socket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [sendData]);

  // const formatTime = () => {
  //   const now = new Date();
  //   let hours = now.getHours();
  //   const minutes = now.getMinutes();
  //   const ampm = hours >= 12 ? "PM" : "AM";
  //   hours = hours % 12;
  //   hours = hours ? hours : 12;
  //   const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  //   const day = now.getDate();
  //   const monthNames = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];
  //   const month = monthNames[now.getMonth()];
  //   const year = now.getFullYear();
  //   const suffix = ["th", "st", "nd", "rd"][
  //     day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
  //   ];

  //   const formattedDate = `${day}${suffix} ${month} ${year}`;
  //   const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

  //   return `${formattedDate} . ${formattedTime}`;
  // };

  const handleSend = () => {
    // const sanitizedMessage = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // const sendData = {
    //   type: "user",
    //   content: sanitizedMessage,
    //   email: "fahad.ahmed@kodexolabs.com",
    //   session_id: "66742106b3419b010ea8cd75",
    //   is_joined: false,
    //   agent_response: "",
    //   created_on: formatTime(),
    // };
    // if (input.trim() !== "") {
    //   console.log("Sending message:", sendData);
    //   setSendData(sendData);
    //   // socket.emit("chat_message", sendData);
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { type: "user", content: input },
    //   ]);
    //   setInput("");
    // }
  };
  const messageSessionBack = () => {
    setMessagesSession(false);
    console.log("helo");
  };

  return (
    <>
      <div className="window_wrap">
        <div className="header">
          <div className="rotated-half-circle"></div>
          <div className="avatar_wrap">
            <img src={Widget} />
          </div>
        </div>
        <div className="window">
          <ChatHeader
            messagesSession={messagesSession}
            messageSessionBack={messageSessionBack}
          />
          {messagesSession ? (
            <>
              <MessagesSession
                status={true}
                chatArray={chatArray}
                chatLoad={false}
              />
              <InputField
                style={{
                  border: "1px solid",

                  borderImageSource:
                    "linear-gradient(90deg, #079485 0%, #115588 100%)",
                }}
                disabled={false}
                sendMessage={sendMessage}
                className={"hello"}
                value={messages}
                setValue={setMessages}
                waitingMessage={"Waiting for message"}
                text={text}
                rows={rows}
                limit={limit}
                maxLength={maxLength}
                inputRef={inputRef}
                handleInputChange={handleInputChange}
                handlePaste={handlePaste}
                handleKeyPress={handleKeyPress}
                handleSubmitMessage={handleSubmitMessage}
                hasLineBreaks={hasLineBreaks}
                updateRows={updateRows}
              />
            </>
          ) : (
            <ChatbotContent
              values={values}
              errors={errors}
              chat={chat}
              isFormActive={isFormActive}
              goBackForm={goBackForm}
              systemId={systemId}
              startSession={startSession}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              goBack={goBack}
              touched={touched}
            />
          )}

          {/* <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non
              labore eligendi voluptates, expedita corrupti quisquam quo quam
              eius? Delectus officiis dolorem est dolores id sapiente? Sint
              animi unde odit et! Repudiandae, itaque? Libero, maxime
              repudiandae. Voluptas sint suscipit, natus veniam tempore odio
              culpa error a alias mollitia sit vel quia est amet illo! Totam
              dolorem dolore corporis voluptatum eos explicabo. Atque veniam
              eius fugiat at quam vitae, odit architecto provident voluptatum
              laudantium labore magnam ratione dignissimos assumenda ducimus
              quod, laboriosam asperiores adipisci soluta cum accusantium?
              Adipisci sit totam inventore maiores. Praesentium repellat
              obcaecati, dolorum eos similique neque sunt odit in dolore enim,
              natus est, reprehenderit molestias at! Hic, suscipit. Sit
              cupiditate adipisci optio obcaecati perspiciatis aliquam maxime
              quia repellat ratione? Natus quasi fugiat modi explicabo, commodi
              accusamus quisquam sequi quod quidem omnis similique
              exercitationem libero magnam illo sunt voluptate vel magni iste
              recusandae at alias ea? Labore excepturi dignissimos quasi.
              Laborum ab rerum tempore, distinctio doloremque necessitatibus
              optio culpa, blanditiis autem, eaque vel. Maxime odio dolor fugit
              incidunt, blanditiis iste harum accusamus esse perferendis nam
              quaerat rem excepturi aperiam rerum. Perferendis corporis
              similique possimus maxime autem rem, itaque, aliquid nulla tempora
              obcaecati nam. Facere cumque eius perspiciatis aperiam autem hic,
              amet voluptatibus rerum eveniet earum quibusdam voluptatem nemo
              molestias rem! Hic doloribus in magni iusto, dolorum quo ipsam
              dolores odit, ullam perferendis magnam, commodi eum! Libero
              tempore quos consectetur modi perferendis, ad sint necessitatibus
              veniam non nisi ex itaque blanditiis. Velit dignissimos ad libero,
              voluptates dolore quasi labore, sit ea placeat animi vitae cum
              quia amet suscipit, culpa nesciunt. Fuga repellendus ad maiores
              nesciunt iure odio quasi voluptate iste voluptatibus. Libero
              deserunt quod fugit asperiores fugiat velit, molestias unde,
              voluptates animi, explicabo incidunt quas. Quaerat expedita,
              libero voluptates ratione fugit non consequuntur placeat dolor,
              neque reprehenderit, amet reiciendis! Illum, velit. Vitae
              recusandae quasi ut quisquam saepe reprehenderit, ex est impedit!
              Aliquam reiciendis alias, in illum enim, earum iusto est ex sed
              debitis nihil odit deleniti assumenda veniam quidem tempore
              necessitatibus. Nam recusandae vitae tempora dolorem et dolor
              consequatur tenetur, eligendi quasi magnam voluptate molestiae
              saepe porro. Qui facilis doloremque repellat quaerat perferendis,
              accusantium quis quam, libero hic quisquam et molestias? Iste
              nostrum soluta fugiat quod quasi quia voluptatibus nemo illo esse,
              veniam, ipsa ullam porro iure quidem? Explicabo libero fugit enim
              ipsum neque, nulla debitis, consectetur voluptates harum eius
              cumque. Est, quae. Harum eius minus vero, vitae fugit totam
              explicabo aliquam quidem, molestiae consequuntur quod odit, ad
              corporis corrupti doloremque aliquid iusto deleniti provident
              soluta. Dignissimos consequuntur at quam ut. Odio soluta facilis
              ducimus cum voluptatum totam consectetur officia culpa quos, iste,
              eligendi dolorem quisquam reiciendis, a iusto reprehenderit
              exercitationem rem voluptas repudiandae aut impedit mollitia
              cupiditate! Distinctio, maiores dolorem! Aspernatur, eaque enim
              exercitationem eum consequuntur omnis saepe voluptatibus voluptate
              quibusdam nobis delectus provident adipisci beatae nesciunt
              aliquid sunt at distinctio. Hic, placeat possimus atque reiciendis
              quod ex! Nihil, earum? Ipsum dicta earum nobis odio veniam, rem
              ullam quae laboriosam optio. Nesciunt nam, vero laudantium minus
              mollitia libero, iusto nihil dolores eveniet nostrum animi.
              Tempora harum nihil autem corporis quod. Architecto culpa alias
              placeat perspiciatis est nostrum adipisci, laudantium magni
              exercitationem perferendis velit molestiae quia vitae, dolores
              porro sapiente. Similique, sequi deserunt? Sed repudiandae
              repellat nesciunt iusto velit fugit quo. Repudiandae dolor, sed
              laboriosam reiciendis harum esse aliquid voluptatibus, illo quos
              possimus sapiente? Illum hic praesentium voluptas aut at neque
              aliquam nemo recusandae veniam mollitia veritatis autem, nesciunt
              porro quaerat! Possimus doloremque aspernatur eveniet
              reprehenderit. Doloremque, aliquam laudantium? Deserunt iusto
              consequatur optio aliquam similique quisquam distinctio, placeat
              quod magnam praesentium corporis voluptate molestiae,
              necessitatibus facere quo culpa omnis? Optio, recusandae. Omnis
              quisquam sequi voluptatum, repellat dolores ab commodi quaerat
              veniam nulla distinctio necessitatibus ipsum, porro rerum maxime
              natus labore eum. Sint voluptates officiis rerum eius quaerat
              asperiores veniam, alias corrupti. Exercitationem fugiat officiis
              vitae commodi, impedit, sequi id at quia aliquam suscipit harum
              architecto dolorum et doloremque reiciendis hic itaque
              consequuntur nesciunt, ipsam eveniet inventore laudantium deleniti
              voluptatem. Atque, tenetur. Officiis, veritatis maxime commodi
              fuga veniam nostrum temporibus ad ipsam asperiores, in mollitia
              laudantium cum odio unde praesentium? Cum beatae consequatur fugit
              doloribus accusantium ad illo aperiam officiis qui inventore!
              Laborum odit debitis nobis error quibusdam doloribus asperiores
              dolorum, ipsam in, officia, beatae veniam. Consequuntur asperiores
              nesciunt, earum tempore dolores reprehenderit, aut necessitatibus
              iste quidem deleniti quo quae, similique incidunt? Aperiam
              repellat facilis similique cupiditate tempora ut tempore soluta
              placeat accusantium dignissimos doloribus expedita magni rem vel
              quos blanditiis, dolor ad iste distinctio molestiae iusto earum
              labore itaque? Nobis, ipsa! Ullam iste impedit tempora voluptate
              sed sequi explicabo obcaecati nihil voluptatem, nulla, earum illum
              praesentium numquam quasi, sapiente aliquam autem facere corporis
              aut. Vel, incidunt facere delectus iure pariatur nulla? Quo
              repellendus tempora et velit, dignissimos sapiente dicta delectus
              recusandae officia impedit est molestiae. Ad, laborum iste
              praesentium aliquam id suscipit perspiciatis hic delectus quo!
              Illo quidem corrupti cum sit! Dolorem quaerat voluptatem sapiente
              provident eaque, earum fugit consequatur odio quae fuga
              accusantium exercitationem sed quibusdam architecto vel quia, non
              reiciendis facere repudiandae necessitatibus aut modi? Provident
              tenetur pariatur mollitia. Tempore consequatur voluptas nam fugiat
              iure! Dolorem, fugiat, iusto porro eos soluta dolore fugit
              dolores, cupiditate itaque quis blanditiis. Recusandae est
              obcaecati nesciunt soluta necessitatibus. A nemo voluptatibus qui
              impedit. Eligendi est dolorum error debitis officiis cumque vero
              eaque unde accusamus nostrum odio id cum, suscipit nobis nam sed
              ullam consequuntur harum, libero, laudantium nisi quia! Mollitia
              similique eum accusamus! Perferendis, nesciunt magnam
              reprehenderit quos vitae, ab quae corporis soluta voluptatibus
              voluptas nobis labore quam dolores maiores omnis maxime. Ipsam
              eius a consequatur sed, totam esse adipisci? Earum, quod possimus!
              Perferendis assumenda exercitationem error eaque molestias,
              obcaecati vero ratione voluptate reiciendis possimus tenetur nobis
              explicabo nisi dolore, atque expedita voluptatibus cumque incidunt
              facere iure dicta optio! Iure perspiciatis iste consequuntur.
              Optio iure voluptas voluptatum a, libero debitis dolores pariatur
              aspernatur? Molestiae harum nulla labore quasi doloremque
              cupiditate, sed veniam, culpa laborum dolorum perferendis facere.
              Iste ratione quaerat illo sit incidunt. Tempore eligendi facilis,
              eos vel deserunt perferendis maxime reiciendis sequi omnis
              quisquam beatae adipisci exercitationem nobis quae explicabo
              delectus perspiciatis voluptas esse quaerat reprehenderit quos
              accusantium inventore. Dolore, dignissimos laudantium. Omnis,
              ipsa. Obcaecati error tempora officia, ipsam quos consectetur in
              quaerat ea quae dolorum veritatis, aliquid iure cupiditate
              doloribus deleniti, cumque odio porro autem repudiandae est? Culpa
              ducimus similique expedita! Ea, quia explicabo doloribus iure
              facilis, est nesciunt eaque corrupti architecto dolorem pariatur
              qui assumenda accusantium eius blanditiis earum eveniet nemo
              repellat quos ab id consequuntur esse iste! Beatae, soluta? Ipsam
              rerum perferendis quaerat totam ea sint possimus necessitatibus
              laudantium, amet ducimus, tempora quam. Maiores fuga, molestiae ad
              magni temporibus veritatis voluptates esse, omnis neque sint cum
              obcaecati, pariatur officiis. Beatae, architecto sint fuga
              molestiae aspernatur quos aliquid ipsum necessitatibus esse, nemo
              odit recusandae, sapiente porro tempore commodi perspiciatis. A
              suscipit sit deleniti consequuntur eaque, officia alias non iusto
              maxime? Eligendi aut magni cumque, voluptas ea debitis consequatur
              quo alias officiis sint laborum deserunt cupiditate! Accusantium
              cumque laudantium ipsa a inventore doloremque quod magni ipsum
              nulla, odio quisquam architecto temporibus. Deleniti tempora atque
              debitis, totam doloribus tenetur iste corporis expedita officiis
              dicta dolorem tempore quam eius molestias voluptates eveniet, quis
              veritatis omnis? Maiores blanditiis commodi, repellendus eum alias
              eveniet laborum! Corrupti libero accusamus magni ullam veniam
              repellendus, labore voluptate laudantium minima. Nulla dolorem,
              enim perferendis necessitatibus quae dolores ipsam! Facilis facere
              error voluptate in ducimus porro corrupti, dignissimos cum ut!
              Sint perferendis repudiandae sunt ad deleniti, enim voluptate
              impedit consequuntur neque expedita asperiores excepturi suscipit
              ipsam doloribus officia at est dolor et mollitia modi rerum illum
              maiores culpa. Ducimus, quia. Velit doloremque corporis vitae
              quos. Quibusdam aut omnis placeat! Quod quam, eius provident amet
              nostrum necessitatibus quasi hic sequi eos totam inventore!
              Accusantium recusandae, et quis aperiam libero nobis minus? Eius,
              quis doloremque perspiciatis enim commodi, ab omnis fuga velit aut
              aliquam laudantium quae ad voluptate iste temporibus nemo harum.
              Unde ex, nesciunt quo et odio deleniti libero corrupti magnam.
              Odio quo vel velit saepe consequatur dolorem reiciendis mollitia
              itaque incidunt quasi? Explicabo odio nisi tenetur, facere aperiam
              eius ipsa veniam hic quos numquam vel eaque impedit placeat qui
              harum. Voluptatem illo quasi laborum beatae soluta! Corrupti,
              dolor? Cumque non quae quaerat ullam doloribus magni officia
              tenetur accusantium fugit consectetur, optio libero pariatur quia
              praesentium nostrum. Temporibus reprehenderit fuga repudiandae?
              Quisquam suscipit cupiditate error culpa vitae aliquam adipisci
              nisi in quaerat autem similique cum consequuntur, aliquid iusto
              at, ducimus magnam. Porro esse earum nulla expedita nemo doloribus
              repellat voluptatum praesentium. Sapiente atque, doloremque
              explicabo obcaecati voluptatibus in tempore odio vero consectetur
              error sequi, totam voluptates reiciendis, enim sit corporis soluta
              tenetur optio repellendus nobis? Fugit similique ad quas
              necessitatibus sit. Eveniet quod corrupti ex deserunt
              necessitatibus saepe! Inventore aliquid doloribus magnam placeat
              expedita consectetur neque sit dignissimos molestias accusamus
              aperiam ratione, debitis iusto porro soluta sed natus repudiandae
              deserunt! Sunt? Expedita distinctio, nobis aut nostrum quasi sunt
              obcaecati modi recusandae tenetur reprehenderit quod molestias
              iste asperiores amet aperiam ipsam consectetur! Dolore quibusdam
              suscipit dolorum velit ut voluptas voluptates quo unde! Animi nam
              alias nulla ipsa nemo accusamus expedita explicabo voluptate
              architecto tempore commodi, saepe, blanditiis quaerat aliquam
              dolores repudiandae. Rem laboriosam praesentium adipisci eius,
              officia eligendi sunt vel tenetur possimus. Ducimus quia fugit
              pariatur ipsam accusamus provident, non corporis dicta eos! Illum,
              dolore magnam consequatur labore, debitis autem optio provident
              voluptate voluptatum aliquam cum voluptates veritatis ex
              distinctio culpa tempora. Tempore sapiente id officia voluptate
              dolores quae, ipsum, cupiditate sequi inventore reprehenderit
              repellat? Illum harum culpa beatae, voluptas rem debitis quasi,
              modi velit at quia quae nemo doloremque veritatis labore. Nobis
              doloremque veniam maxime velit accusamus neque laboriosam atque
              porro consequuntur illum? Velit inventore repudiandae cumque
              aperiam tempore repellat laborum ipsam totam iste facere! Vero
              saepe ipsam voluptatem dolores optio. Sunt harum quo corrupti
              ratione unde culpa quaerat, eius, eum obcaecati quis facilis amet
              a ducimus tempore labore. Doloremque, magnam enim? Ad, iusto
              corporis veniam pariatur amet ab modi. Modi? Debitis quas
              voluptate, sint explicabo eius ab magnam labore numquam velit
              doloremque nostrum odio facilis. Quo eligendi culpa, cupiditate
              quas minima corporis sint facilis necessitatibus sit soluta non
              possimus consequuntur? Excepturi magni ducimus voluptatibus
              expedita odio numquam commodi eveniet at ea enim explicabo
              deserunt ullam quo, a cumque quasi, assumenda, optio laborum sed
              nobis vitae quis pariatur veniam maxime. Libero. Animi ad
              repellendus, quibusdam debitis earum reprehenderit! Asperiores
              veniam quod officiis, quam impedit, quibusdam dolor sequi saepe,
              in delectus dicta. Dignissimos deserunt nisi laudantium
              consequuntur libero inventore consectetur, provident laborum.
              Nulla officiis in praesentium officia ipsa ex facilis! Fugit, hic
              aperiam quos vitae ullam veritatis voluptatibus quis magnam
              laborum harum quae nam beatae sunt commodi non architecto?
              Temporibus, quia non! Fugiat reprehenderit modi reiciendis,
              delectus minima ut impedit exercitationem dicta. Eum facere culpa,
              optio necessitatibus, ut dolore aliquid officia expedita
              voluptatum nisi, illum earum iusto iure ipsum asperiores ullam
              magnam! Molestias, quod recusandae ut, quasi quae aut eligendi
              excepturi dignissimos, consequuntur esse reprehenderit accusantium
              eius molestiae voluptatum! Quo earum eaque quaerat exercitationem
              enim quibusdam impedit quis mollitia doloremque. Hic,
              perspiciatis? Reiciendis veritatis harum dolorum odio iusto rerum
              fugiat obcaecati aut accusantium sint debitis, enim perspiciatis
              nulla explicabo corrupti libero dolorem, numquam consequuntur
              ipsam, earum ut nobis? Numquam omnis natus adipisci! Mollitia,
              repellendus aut voluptatem nisi iure odit culpa enim et quod iusto
              expedita asperiores distinctio, quisquam sequi adipisci! Veniam
              ullam magnam soluta corporis vero natus alias perspiciatis aliquid
              obcaecati enim? Praesentium minima, magnam placeat neque eos ipsam
              ab provident odit voluptates labore ullam architecto. Similique
              totam assumenda, dicta nam reiciendis excepturi, id et quam nisi
              laboriosam perspiciatis, dolores vitae corrupti! Tenetur dolore
              minima incidunt inventore quos autem, sit at nulla. Sunt dolores
              nulla laborum, temporibus aut, minus dicta molestias consectetur
              ut laboriosam explicabo praesentium. Non repellendus labore sunt
              earum perspiciatis. Ab reprehenderit consequuntur quam explicabo
              sunt tenetur ipsam rem inventore? Distinctio laboriosam qui
              incidunt laborum repellat excepturi rerum in hic porro, ex tempore
              corporis aspernatur nihil quaerat impedit unde aperiam.
              Reprehenderit, nostrum? Recusandae itaque nostrum nobis corrupti
              fugit. Facere adipisci ullam illo natus voluptate at expedita
              dolorum, et dignissimos corrupti alias molestias quod dolores,
              quas consectetur corporis pariatur dicta illum! At tenetur ab
              optio iste odit rem magni in aut facere quia libero beatae harum
              doloremque officiis ipsum ratione doloribus molestiae quisquam
              maxime aspernatur voluptatibus fugiat, quibusdam nemo. Dolorem,
              neque! Atque voluptatibus similique reprehenderit odit minus,
              cupiditate saepe provident maxime omnis, unde voluptatem
              dignissimos voluptas nihil aspernatur illo non eum, libero
              sapiente ea sed ullam fugiat ducimus. Rerum, facilis ut. Accusamus
              iure quis omnis delectus sed magnam fugit ex veniam voluptatibus
              repudiandae sint labore, id in at iusto accusantium quos doloribus
              totam eligendi. Maxime esse laboriosam magnam aliquid inventore.
              Rerum? Error quidem nostrum laborum atque tempora impedit
              praesentium expedita molestiae. Aut sequi ad voluptatum non
              assumenda inventore obcaecati nulla, hic accusamus repudiandae
              beatae dolor eum earum nihil id repellendus veritatis. Maxime,
              optio. Expedita eaque quisquam, asperiores dolores dolore rem quae
              neque corrupti, molestiae ipsum deleniti doloremque consectetur
              nulla voluptate non nam esse cum pariatur veniam dolorum
              temporibus maiores provident. Facilis? Quam quaerat temporibus
              expedita dolore praesentium eius consequuntur esse vero, tempore
              cumque voluptatum doloremque eveniet, molestiae, rerum
              necessitatibus nam accusamus beatae officia facere hic distinctio
              libero dolor possimus aspernatur? Laboriosam. Ipsa earum quis ea
              sequi alias assumenda eaque facilis libero amet nostrum, commodi
              consequuntur exercitationem? Exercitationem sit optio eos
              molestiae provident, nam obcaecati alias consectetur vitae, minima
              enim, ea quos. Quam, labore deserunt porro pariatur perspiciatis
              impedit, architecto, maiores id exercitationem aliquid esse
              nesciunt? Odio, delectus cum modi hic, ipsam error alias
              distinctio voluptatibus nisi numquam porro eaque inventore illo?
              Ut vel id ducimus aspernatur, qui deserunt minus blanditiis ex.
              Quae, voluptas quo veniam quia nulla dolorem cumque, autem rerum
              impedit quidem sapiente, assumenda ea suscipit maxime numquam
              obcaecati iusto. Doloribus quia omnis molestiae provident animi
              perspiciatis molestias sapiente at, eligendi culpa reiciendis hic
              quo quam, tempora praesentium labore laboriosam vitae! Eaque quo
              excepturi eius voluptatibus adipisci, sint et delectus! Tempora,
              molestiae atque aliquid maiores asperiores quas, nisi dolorum
              libero, iste unde veritatis. Accusamus aut consequatur obcaecati
              praesentium asperiores, dolorem repudiandae doloribus ad dolor
              iusto id tempore numquam sit inventore? Saepe voluptate enim quos
              nobis facilis aperiam iste totam magnam provident? Tempora
              architecto atque est aliquid eveniet deleniti dolorem recusandae,
              ipsam quisquam facilis quasi dolor eum quidem perferendis qui
              voluptates. Nobis magnam dolor eos quidem distinctio eveniet ipsam
              repudiandae obcaecati autem consectetur optio quos quibusdam, iure
              commodi non illum inventore vero tempore doloribus nihil facilis.
              Repellat consequatur excepturi eum ipsum? In deleniti voluptatum
              accusantium eveniet cumque doloremque. Neque quis ex a nesciunt
              odit, optio consequuntur. Dolores, repudiandae veritatis quaerat,
              dolorem atque eos asperiores veniam amet eveniet natus blanditiis
              neque in? In optio doloremque sint consequuntur cum impedit saepe
              dolores magni culpa! Ex doloremque itaque possimus sit aperiam
              veniam consequuntur alias tenetur. Distinctio laboriosam officiis
              omnis excepturi animi veritatis quo quibusdam! Voluptatem saepe
              harum mollitia aspernatur quam ducimus doloremque itaque ratione,
              ex voluptate quas quasi ipsa corrupti magnam sapiente. Debitis
              aliquam facilis quisquam doloribus quos. Doloribus id porro harum!
              Deserunt, vel? Totam unde vitae assumenda minima in vero fugiat
              rerum praesentium voluptates sint dolore voluptatum sed iste
              ratione, delectus cumque reprehenderit ab tempora perspiciatis non
              ipsam. Quis quia amet quo excepturi? Magni odit earum vero
              veritatis veniam totam deleniti maiores rerum ad suscipit minima
              voluptates laborum, dolore omnis asperiores aperiam nostrum quis
              nesciunt exercitationem fuga similique placeat. Cupiditate illum
              tempore ipsa. Inventore iusto impedit deserunt numquam amet eaque
              atque sapiente enim a, adipisci excepturi minus odio, sed ipsam
              aliquam nisi, labore corporis! Id eligendi distinctio ipsam
              laboriosam impedit perspiciatis dolores reprehenderit? Cum iste
              fugit asperiores provident dolorum et tempora, nihil, quasi maxime
              consequuntur doloribus sapiente laboriosam, veniam fuga facere
              voluptatum harum error. Excepturi, assumenda a velit fugit
              molestias nihil rem ullam. Labore libero quasi explicabo natus
              doloribus aut sunt porro, recusandae minus voluptatum, et est?
              Saepe, ab. Autem exercitationem iusto voluptas minus amet
              laboriosam, accusamus quidem quis. Mollitia numquam veritatis et!
              Eius sed voluptatum rerum fuga magnam quis aspernatur, ipsam
              asperiores soluta explicabo commodi itaque consectetur ducimus
              voluptatem odit, ad numquam dolorem! Voluptatibus illum
              reprehenderit earum. Similique neque accusantium nesciunt nihil?
              Molestiae quisquam quasi animi! Accusantium tenetur id, aliquid ea
              cum autem voluptatum, illo ipsum sed reiciendis facilis
              consequatur officia exercitationem quaerat dolorem in accusamus
              dolores distinctio provident reprehenderit debitis quam. Facilis
              reiciendis quidem quis provident. Tempora iusto cupiditate nobis
              eaque, enim repellendus quam pariatur molestias, repudiandae,
              possimus eveniet aut placeat facere perspiciatis dolor. Id,
              inventore! Aliquam quia in itaque animi. Iste illum temporibus
              tenetur adipisci voluptatibus, sit placeat vero harum ea. Commodi
              aliquam eligendi quibusdam? Voluptate fugiat accusamus sed,
              laudantium iste et quod dolore corporis excepturi, sint iure vero
              amet. Modi tempora cumque consequuntur architecto explicabo
              perspiciatis molestias, illo culpa corporis eligendi laborum
              praesentium cupiditate quisquam voluptatum sunt tempore ipsum
              perferendis ipsa nobis voluptas minus. Ullam blanditiis asperiores
              id magnam? Tenetur earum fugiat officia atque error at doloribus
              ipsum inventore quia! Labore quo corrupti vel quam magni velit
              maxime perferendis illo possimus voluptates. Veritatis, velit?
              Earum dignissimos iure reprehenderit? Nihil? Nesciunt numquam rem
              cupiditate porro? Aspernatur fugit quae sint ab, voluptatum,
              perspiciatis quos molestiae a eum accusamus voluptatem doloremque?
              Ducimus deserunt a assumenda dolorem cum blanditiis, at ullam sunt
              voluptatibus. Debitis accusantium deleniti eos laborum aliquid
              placeat perferendis suscipit nostrum! Ipsum vero tenetur velit
              officia doloremque ea laborum magnam enim quo, soluta reiciendis
              aliquid. Corrupti repudiandae praesentium laboriosam cum aut.
              Debitis beatae ex magnam, nesciunt laboriosam voluptatem pariatur
              in quisquam earum eius quaerat quidem, vel maxime repellendus
              amet. Nisi dolorum possimus doloribus at facilis. Repudiandae
              voluptas quas sint perferendis quis. Similique quisquam expedita
              distinctio nihil architecto at ad itaque repudiandae unde officiis
              quo saepe incidunt consequatur id doloremque amet corporis iste
              aliquam, esse labore facere cupiditate aut ut. Debitis,
              voluptatibus. Sed, alias voluptatum repellendus ipsa ut enim aut
              quisquam quia autem vitae delectus architecto laudantium quaerat
              perspiciatis libero at neque non quos reiciendis nam odit
              pariatur. Impedit sit ratione ipsum? Nemo incidunt iure totam
              expedita maiores, quasi est libero quia cumque aliquam nihil hic
              ut rerum eaque officia dolor, eius repellendus obcaecati et
              praesentium quo? Deleniti, deserunt? Minima, at nobis?
            </p> */}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
