import Dropdown from "../../components/Dropdown/Dropdown";
import DropdownItem from "../../components/DropdownItem/DropdownItem";
import "./styles.css";
import api from "../../services/api";
import { useState, useEffect } from "react";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [message, setMessage] = useState("");
  const [logHistory, setLogHistory] = useState([]);
  const [category, setCategory] = useState([]);

  async function getLogHistory() {
    try {
      const response = await api.get("/notification/history");
      setLogHistory(response.data);
    } catch (err) {
      console.error("Error while getting logs:", err);
    }
  }
  
  async function getCategories() {
    try {
      const response = await api.get("/category");
      setCategory(response.data);
    } catch (err) {
      console.error("Error while getting categories:", err);
    }
  }

  useEffect(() => {
    getCategories();
    getLogHistory();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Notification Sender</h1>
        <Dropdown
          buttonText={`${selectedCategory?.name ?? "Select a Category"}`}
          content={
            <>
              {category.map((item) => (
                <DropdownItem
                  key={item.id}
                  onClick={() => setSelectedCategory(item)}
                >
                  {item.name}
                </DropdownItem>
              ))}
            </>
          }
        />
        <input
          placeholder="Notification Message"
          name="message"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (!selectedCategory) {
              alert("Please, select a category.");
              return;
            }

            if (!message.trim()) {
              alert("Please, write a message.");
              return;
            }
        
            const body = {
              categoryId: selectedCategory.id,
              message: message.trim(),
            };

            console.log("Enviando para o servidor:", body);
          }}
        >
          Send
        </button>
      </form>

      {logHistory.map((log) => (
        <div key={log.id} className="card">
          <div>
            <p>
              id: <span>{log.id}</span>
            </p>
            <p>
              Name: <span>{log.user.name}</span>
            </p>
            <p>
              Categoty: <span>{log.category.name}</span>
            </p>
            <p>
              Notification Type: <span>{log.notificationType.name}</span>
            </p>
            <p>
              Message: <span>{log.message}</span>
            </p>
            <p>
              Sent Time: <span>{log.sentTimestamp}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
