# Coding Challenge
A full stack project created at my time on the Red Tech Team at Spot Inc. The intention was to create a web app that allows users to manage customers and orders (in freight). 
You can specify things like order type and customer name. 
Created the database in Microsoft SQL Server initially, but then migrated it to Supabase in order to utilize its built in Auth functions and PostgreSQL database.
Learned a lot about React and front end design as well and back end design too.

![image](https://github.com/abhishekaddagatla/Coding-Challenge/assets/45775590/5a866f22-975d-461f-8914-ac99065f6d34)

### Things I Learned
- The Importance of decoupling the frontend and backend
- I learned what a repository/service layer was and the significance of the abstraction between the API/Controller and the database context
- Building off the previous point, I learned what Dependecy Injection was and the different DI lifetimes
- Implemented authentication with Supabase and learned the usage of JWT tokens and API auth as well: The API will not accept requests that have not been authorized by the JWT token

Example of an unauthorized request (postman):
![image](https://github.com/abhishekaddagatla/Coding-Challenge/assets/45775590/ce71495e-0f5a-4538-8eb9-ba168caf057f)

