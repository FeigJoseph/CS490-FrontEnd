import React, { useState, useEffect, useMemo } from "react";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState({ customers: [] });

  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchID, setSearchID] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [formError, setFormError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [delCustID, setDelCustID] = useState(null);

  useEffect(() => {
    // Fetch movies data or perform any initialization
    fetch("/allCustomers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        //console.log(data);
      });
  }, []);

  // Filtering
  const filteredCustomers = useMemo(() => {
    return customers.customers.filter(
      (customer) =>
        (searchID === null || customer[0].toString().includes(searchID)) &&
        (searchFirstName === "" ||
          customer[1].toLowerCase().includes(searchFirstName.toLowerCase())) &&
        (searchLastName === "" ||
          (customer[2] &&
            customer[2].toLowerCase().includes(searchLastName.toLowerCase())))
    );
  }, [searchFirstName, searchLastName, searchID, customers.customers]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [paginatedCustomers, setPaginatedCustomers] = useState([]);

  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    setPaginatedCustomers(filteredCustomers.slice(start, start + itemsPerPage));
  }, [currentPage, filteredCustomers, itemsPerPage]);

  // add Customer
  const handleAddCustomer = (e) => {
    e.preventDefault();

    const newCustomer = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      address: streetAddress,
      city: city,
      country: country,
      postalCode: postalCode,
    };

    fetch("/addCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCustomer),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("New customer added:", newCustomer);
        console.log(data.message);
        // Clear the form and customer info after submission
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error adding new customer:", error);
      });
  };

  // Form Validation
  const formValidation = () => {
    if (firstName === "") {
      setFormError("First Name is blank");
    } else if (lastName === "") {
      setFormError("Last Name is blank");
    } else if (email === "") {
      setFormError("Email is blank");
    } else if (phoneNumber === "") {
      setFormError("Phone Number is blank");
    } else if (phoneNumber !== null && phoneNumber.length !== 10) {
      setFormError("Phone Number must be 10 numbers");
    } else if (streetAddress === "") {
      setFormError("Street Address is blank");
    } else if (city === "") {
      setFormError("City is blank");
    } else if (country === "") {
      setFormError("Country is blank");
    } else if (postalCode === "") {
      setFormError("Postal Code is blank");
    } else {
      setFormError("");
    }
    setFormValid(
      firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
        phoneNumber !== "" &&
        phoneNumber !== null &&
        phoneNumber.length === 10 &&
        streetAddress !== "" &&
        city !== "" &&
        country !== "" &&
        postalCode !== ""
    );
  };

  // Delete Customer
  useEffect(() => {
    if (delCustID) {
      const delCustomer = {
        customerID: delCustID,
      };

      fetch("/delCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(delCustomer),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Query Successful:");
          console.log(data.message);
          // Clear the form and customer info after submission
          setDelCustID(null);
        })
        .catch((error) => {
          console.error("Error deleting customer:", error);
        });
    }
  }, [delCustID]);

  const handleDelCustomer = (id) => {
    setDelCustID(id);
  };

  function InfoBox({ customer }) {
    const [showModal, setShowModal] = useState(false);
    const [editState, setEditState] = useState(false);

    const handleOpenModal = () => {
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setEditState(false);
    };

    useEffect(() => {
      if (editState) {
        console.log("Edit");
      }
    }, [editState]);

    const handleFormSubmit = () => {
      const updatedCustomer = {
        id: customer[0],
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        address: document.getElementById("streetAd").value,
        city: document.getElementById("city").value,
        country: document.getElementById("country").value,
        phone: document.getElementById("phone").value,
        postal: document.getElementById("postal").value,
      };

      console.log(updatedCustomer.address);

      fetch("/updateCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Query Successful:");
          console.log(data.message);

          setEditState(false);
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error updating customer:", error);
        });
    };

    return (
      <>
        <button
          className="table-style button info-button"
          onClick={handleOpenModal}
        >
          Info
        </button>
        {showModal && (
          <dialog open>
            <div>
              <div style={{ display: "flex" }}>
                <h2 style={{ width: "70%" }}>Customer Info</h2>
                <button
                  className="edit-button"
                  style={{ height: "50px", width: "80px" }}
                  onClick={() => {
                    setEditState(true);
                  }}
                >
                  Edit
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFormSubmit();
                }}
              >
                <p>
                  <strong>ID:</strong>{" "}
                  <input disabled={true} defaultValue={customer[0]} />
                </p>
                <p>
                  <strong>First Name:</strong>{" "}
                  <input
                    id="firstName"
                    disabled={!editState}
                    defaultValue={customer[1]}
                  />
                </p>
                <p>
                  <strong>Last Name:</strong>{" "}
                  <input
                    id="lastName"
                    disabled={!editState}
                    defaultValue={customer[2]}
                  />
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <input
                    id="email"
                    disabled={!editState}
                    defaultValue={customer[3]}
                  />
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  <input
                    id="streetAd"
                    disabled={!editState}
                    defaultValue={customer[4]}
                  />{" "}
                  <input
                    id="city"
                    disabled={!editState}
                    defaultValue={customer[6]}
                  />
                  ,{" "}
                  <input
                    id="country"
                    disabled={!editState}
                    defaultValue={customer[7]}
                  />{" "}
                  <input
                    id="postal"
                    disabled={!editState}
                    defaultValue={customer[8]}
                  />
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  <input
                    id="phone"
                    disabled={!editState}
                    defaultValue={customer[5]}
                  />
                </p>
                <div style={{ display: "flex", marginBottom: "2%" }}>
                  {editState && (
                    <button
                      style={{
                        height: "50px",
                        width: "90px",
                        backgroundColor: "grey",
                        marginRight: "5%",
                      }}
                      type="reset"
                    >
                      Reset
                    </button>
                  )}
                  {editState && (
                    <button
                      style={{
                        height: "50px",
                        width: "90px",
                        backgroundColor: "dimgrey",
                      }}
                      type="submit"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
              <button
                className="table-style button close-button"
                style={{ backgroundColor: "red" }}
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </dialog>
        )}
      </>
    );
  }

  function RentHistoryBox({ customer }) {
    const [rentals, setRentals] = useState({ rentals: [] });
    const [showModal, setShowModal] = useState(false);

    const updatedCustomer = {
      id: customer[0],
    };

    const handleFormOpen = () => {
      // Fetch movies data or perform any initialization
      fetch("/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Query Successful:");
          console.log(data.message);
          setRentals(data);
        })
        .catch((error) => {
          console.error("Error updating customer:", error);
        });
    };

    const handleOpenModal = () => {
      handleFormOpen();
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
    };

    // Filtering
    const filteredRentals = useMemo(() => {
      return rentals.rentals.filter((rental) => customer[0] === rental[3]);
    }, [rentals.rentals, customer]);

    return (
      <>
        <button
          className="table-style button rentalHistory-button"
          onClick={handleOpenModal}
        >
          Rental History
        </button>
        {showModal && (
          <dialog open style={{ maxHeight: "300px", overflowY: "scroll" }}>
            <button
              className="table-style button close-button"
              style={{ backgroundColor: "red" }}
              onClick={handleCloseModal}
            >
              Close
            </button>
            <div style={{ maxHeight: "100%" }}>
              <table>
                <thead>
                  <tr>
                    <th>Rental ID</th>
                    <th>Rental Date</th>
                    <th>Return By</th>
                    <th>Return Date</th>
                    <th>Inventory ID</th>
                    <th>Customer ID</th>
                    <th>Staff ID</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.map((rental) => (
                    <tr
                      key={rental[0]}
                      style={{
                        backgroundColor:
                          new Date() > new Date(rental[7]) && !rental[4]
                            ? "lightpink"
                            : "transparent",
                      }}
                    >
                      <td>{rental[0]}</td>
                      <td>{rental[1]}</td>
                      <td>{rental[7]}</td>
                      <td
                        style={{
                          backgroundColor:
                            rental[4] === null ? "red" : "transparent",
                        }}
                      >
                        {rental[4]}
                      </td>
                      <td>{rental[2]}</td>
                      <td>{rental[3]}</td>
                      <td>{rental[5]}</td>
                      <td>{rental[6]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                className="table-style button close-button"
                style={{ backgroundColor: "red" }}
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </dialog>
        )}
      </>
    );
  }

  // Page
  return (
    <div>
      <h1>Customers Page</h1>
      {/* Display movies or any other content */}
      {typeof customers.customers === "undefined" ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginBottom: "2%",
            }}
          >
            <label>Search ID: </label>
            <input
              type="text"
              placeholder="ID"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
            />

            <label>Search First Name: </label>
            <input
              type="text"
              value={searchFirstName}
              placeholder="First Name"
              onChange={(e) => setSearchFirstName(e.target.value)}
            />

            <label>Search Last Name: </label>
            <input
              type="text"
              placeholder="Last Name"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
            />
          </div>

          {/*Pagination and Add Customer*/}
          <div>
            <div>
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                First Page
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous Page
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredCustomers.length / itemsPerPage)
                }
              >
                Next Page
              </button>
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.ceil(filteredCustomers.length / itemsPerPage)
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(filteredCustomers.length / itemsPerPage)
                }
              >
                Last Page
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "1%",
              }}
            >
              <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Add Customer"}
              </button>
              <br />
              {showForm && formError !== "" && (
                <div>
                  <p style={{ color: "red" }}>{formError}</p>
                </div>
              )}
              {/* Add Customer Form */}
              {showForm && (
                <div
                  style={{
                    backgroundColor: "lightgrey",
                  }}
                >
                  <form onSubmit={handleAddCustomer}>
                    <label>First Name: </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={() => formValidation()}
                    />
                    <label>Last Name: </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={() => formValidation()}
                    />
                    <br />
                    <label>Email: </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => formValidation()}
                    />
                    <label>Phone Number: </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onBlur={() => formValidation()}
                    />
                    <br />
                    <br />
                    <label>Address: </label>
                    <input
                      type="text"
                      id="address"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      onBlur={() => formValidation()}
                    />
                    <label>City: </label>
                    <input
                      type="text"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onBlur={() => formValidation()}
                    />
                    <br />
                    <label>Country: </label>
                    <input
                      type="text"
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      onBlur={() => formValidation()}
                    />
                    <label>Postal Code: </label>
                    <input
                      type="number"
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      onBlur={() => formValidation()}
                    />
                    <br />
                    <br />
                    <button type="submit" disabled={!formValid}>
                      Submit
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <table className="table-style">
            <thead>
              <th>Customer ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Info</th>
              <th>Rental History</th>
              <th>Delete</th>
            </thead>
            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer[0]}>
                  <td>{customer[0]}</td>
                  <td>{customer[1]}</td>
                  <td>{customer[2]}</td>
                  <td>{customer[3]}</td>
                  <td>
                    <InfoBox customer={customer} />
                  </td>
                  <td>
                    <RentHistoryBox customer={customer} />
                  </td>
                  <td>
                    <button
                      className="table-style button delete-button"
                      onClick={() => {
                        handleDelCustomer(customer[0]);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Customers;
