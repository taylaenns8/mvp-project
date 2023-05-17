
document.addEventListener("DOMContentLoaded", function() {
    var getStartedButton = document.querySelector("#get-started-btn");
    var suCloseButton = document.querySelector(".su-btn-close");
    var liCloseButton = document.querySelector(".li-btn-close");
    var editCloseButton = document.querySelector(".edit-btn-close");
    var signupmodal = new bootstrap.Modal(document.querySelector("#signupModal"));
    var loginModal = new bootstrap.Modal(document.querySelector("#loginModal"));
    var updateModal = new bootstrap.Modal(document.querySelector("#updateModal"));
    var signUpButton = document.querySelector("#modal-signup");
    var loginButton = document.querySelector("#modal-login");
    var updateButton = document.querySelector("#modal-update");


    async function postData(url = "", data = {}) {
        const response = await fetch(url, {
          method: "POST", 
        //   mode: "cors", // no-cors, *cors, same-origin
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), 
        });
        return response.json(); 
    
      }
    

    function showSignUpModal() {
        signupmodal.show();
      }

    getStartedButton.addEventListener("click", showSignUpModal);
  
    suCloseButton.addEventListener("click", function() {
        signupmodal.hide();
    });

    var signUpNavLink = document.querySelectorAll(".signup-link");
      signUpNavLink.forEach(function(link) {
        link.addEventListener("click", function(event) {
          event.preventDefault();
          showSignUpModal();
        });
    }); 

    var loginNavLink = document.querySelectorAll(".login-link");
      loginNavLink.forEach(function(link) {
        link.addEventListener("click", function(event) {
          event.preventDefault();
          loginModal.show();
        });

});

    liCloseButton.addEventListener("click", function() {
        loginModal.hide();
    });


    signUpButton.addEventListener("click", async function(event) {
        event.preventDefault();
    
        // Get the values from the input fields
        var suName = document.querySelector("#suName").value;
        var suEmail = document.querySelector("#suEmail").value;
        var suPassword = document.querySelector("#suPassword").value;
        var suTitle = document.querySelector("#suTitle").value;
        var suDescription = document.querySelector("#suDescription").value;
    
        if (suName === '') {
            alert('Please enter your Name');
            return;
          }
    
          if (suEmail === '') {
            alert('Please enter an email');
            return;
           }
           
           if (suPassword === '') {
            alert('Please enter a password'); 
            return; 
           }
        
           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
           if (!emailRegex.test(suEmail)) {
               alert('Please enter valid email');
             return;
           }
        
           if (suPassword.length < 8) {
               alert('Please enter password with atleast 8 characters');
             return;
           }

           try {
            // Register the user and add portfolio info
            const response = await fetch('/api/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: suName,
                email: suEmail,
                password: suPassword,
                title: suTitle,
                description: suDescription,
              }),
            });
        
            if (!response.ok) {
              alert('Failed to register user');
              return;
            }
        
            alert('Registration completed successfully');
          } catch (error) {
            console.error(error);
            alert('An error occurred during registration');
          }
    
        // Close the modal
        signupmodal.hide();
      });
        

        loginButton.addEventListener("click", async function(event) {
          event.preventDefault();
        
          // Get the values from the input fields
          var email = document.querySelector("#email").value;
          var password = document.querySelector("#password").value;

          if (email === '') {
            alert('Please enter an email');
            return;
           }
           
           if (password === '') {
            alert('Please enter a password'); 
            return; 
           }
        
           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
           if (!emailRegex.test(email)) {
               alert('Please enter valid email');
             return;
           }
        
           if (password.length < 8) {
               alert('Please enter password with atleast 8 characters');
             return;
           }
           
           const data = await postData('/api/login', { email, password });
           try {
           if (data.success) {

            console.log('user exists');
            
            const home = document.querySelector('.hero-section');
            $(home).hide();

            const portfolioHead = document.createElement('head-div');
            portfolioHead.setAttribute("id", "portfolio-header");
            portfolioHead.innerHTML = '';

            const portfolioBody = document.createElement('body-container');
            portfolioBody.innerHTML = '';

            fetch('/api/login')
            .then(response => {
                if (!response.ok) {
                throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(userData => {
                console.log(userData);
                for (let i = 0; i < userData.length; i++) {
                    const currentUser = userData[i];
                    if (currentUser.email === email) {
                        
                        console.log(currentUser.name);
                        const name = currentUser.name;
                        const nameElem = document.createElement('h1');
                        document.body.append(portfolioHead);
                        nameElem.innerHTML = `Welcome to your Portfolio, ${name}`;
                        portfolioHead.append(nameElem);
                        const userId = currentUser.id;

                        fetch('/api/portfolio')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch user data');
                                }
                                return response.json();
                        }) 
                        .then(portfolioData => {
                            console.log(portfolioData);
                            for (let i = 0; i < portfolioData.length; i++) {
                                const currentPortfolio = portfolioData[i];
                                if (currentPortfolio.user_id === userId) {
                                    console.log(currentPortfolio.title);
                                    const title = currentPortfolio.title;
                                    const titleElem = document.createElement('h2');
                                    titleElem.setAttribute('id', 'title-elem');
                                    const description = currentPortfolio.description;
                                    const descriptionElem = document.createElement('p');
                                    descriptionElem.setAttribute('id', 'description-elem');
                                    document.body.append(portfolioBody);
                                    titleElem.innerHTML = title;
                                    portfolioBody.append(titleElem);
                                    descriptionElem.innerHTML = description;
                                    portfolioBody.append(descriptionElem);
                                    console.log(currentPortfolio.description);
                                }
                            }
                        })

                    }
                }
                // Rest of the code
            })
            .catch(error => {
                console.error(error);
                // Handle the error
            });

            const editButton = document.createElement('button');
            editButton.setAttribute("id", "edit-btn");
            editButton.textContent = 'edit portfolio';
            document.body.appendChild(editButton);

        editButton.addEventListener("click", function(event) {
            event.preventDefault();
            updateModal.show();
        })

        editCloseButton.addEventListener("click", function() {
            updateModal.hide();
        });

        updateButton.addEventListener("click", function(event) {
            event.preventDefault();
          
            // Get the values from the input fields
            var updatedTitle = document.querySelector("#updateTitle").value;
            var updatedDescription = document.querySelector("#updateDescription").value;
          
            // Perform further actions with the updated title and description, such as sending them to a server or performing validation
            console.log("Updated Title:", updatedTitle);
            console.log("Updated Description:", updatedDescription);

            fetch('/api/login')
            .then(response => {
                if (!response.ok) {
                throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(userData => {
                for (let i = 0; i < userData.length; i++) {
                    const currentUser = userData[i];
                    if (currentUser.email === email) {
                        const userId = currentUser.id;

                        fetch('/api/portfolio')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch user data');
                                }
                                return response.json();
                        }) 
                        .then(portfolioData => {
                            for (let i = 0; i < portfolioData.length; i++) {
                                const currentPortfolio = portfolioData[i];
                                if (currentPortfolio.user_id === userId) {
                                    console.log(userId);
                                    
                                }
                            }

                                fetch(`/api/portfolio/${userId}`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
                              });
                                
                              const portfolioTitle = document.querySelector('#title-elem');
                              const portfolioDescription = document.querySelector('#description-elem');
                              portfolioTitle.textContent = updatedTitle;
                              portfolioDescription.textContent = updatedDescription;
                              console.log("sucess");
                            
                        })

                    }
                }
                // Rest of the code
            })
          
            // Close the modal
            updateModal.hide();
          });

        
           } else {
            console.log('Login failed');
           }
        } catch (error) {
            console.error(error);
            // Handle error occurred during login
            console.log('An error occurred during login');
        
          }
          // Close the modal
          loginModal.hide();
        });
    
      
})


