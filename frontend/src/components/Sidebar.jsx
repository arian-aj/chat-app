import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = () => {
  const [contacts, setContacts] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch("http://localhost:3000/api/contactslist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch contacts");
        }

        setContacts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchContacts();
  }, []);

  const handleAddContact = () => {
    navigate("/AddContact");
  };

  const toggleList = () => {
    setIsListVisible(!isListVisible);
  };

  const handleContactClick = async (contactId) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: localStorage.getItem("userId"),
          recieverId: contactId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create chat");
      }

      navigate(`/chat/${data.newChat._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:3000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to search contacts");
      }

      setSearchResults(data);
    } catch (error) {
      setError(error.message);
    }
  };


   // Handle search query change as the user types
   const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchResults([]);  // Clear results when the input is empty
    } else {
      handleSearch();  // Perform search when typing
    }
  };

  return (
    <aside className="w-64 h-full bg-gray-100 flex flex-col p-4 border-r border-gray-300 z-10">

<div className="search-bar mb-4 relative">
  <input
    type="text"
    value={searchQuery}
    onChange={handleQueryChange}
    placeholder="Search Contacts"
    className="w-full p-2 border border-gray-300 rounded-md"
  />
<FontAwesomeIcon icon="fa-solid fa-magnifying-glass" onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
  
</div>

{/* Show search results */}
<div className="search-results">
  {searchResults.length > 0 && (
    <ul className="space-y-2">
      {searchResults.map((contact, index) => (
        <li
          key={index}
          className="flex items-center py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          onClick={() => handleContactClick(contact._id)}
        >
          <div className="mr-3">
            {contact.profilePicture ? (
              <img
                src={"http://localhost:3000" + contact.profilePicture}
                alt="Profile"
                width={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">No Image</span>
              </div>
            )}
          </div>
          <p className="text-sm">{contact.username}</p>
        </li>
      ))}
    </ul>
  )}
</div>


      <div className="contacts-list">
        <button
          onClick={toggleList}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4">
          Contacts List
        </button>

        {isListVisible && (
          <div className="overflow-hidden transition-all duration-300 ease-in-out">
            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : (
              <ul className="space-y-2">
                {contacts.map((contact, index) => (
                  <li
                    key={index}
                    className="flex items-center py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                    onClick={() => handleContactClick(contact._id)}>
                    <div className="mr-3">
                      {/* Check if contact has a profile picture */}
                      {contact.profilePicture ? (
                        <img
                          src={"http://localhost:3000" + contact.profilePicture}
                          alt="Profile"
                          width={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm">{contact.username}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-4">
        Chats
      </button>

      <button
        onClick={handleAddContact}
        className="mt-auto w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition">
        Add New Contact
      </button>
    </aside>
  );
};

export default Sidebar;
