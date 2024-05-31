# Coding Challenge
A full stack project created at my time on the Red Tech Team at Spot Inc. The intention was to create a web app that allows users to manage customers and orders (in freight). 
You can specify things like order type and customer name. 
Created the database in Microsoft SQL Server initially, but then migrated it to Supabase in order to utilize its built in Auth functions and PostgreSQL database.
Learned a lot about React and front end design as well and back end design too.

### Things I Learned
- The Importance of decoupling the frontend and backend
- I learned what a repository/service layer was and the significance of the abstraction between the API/Controller and the database context
- Building off the previous point, I learned what Dependecy Injection was and the different DI lifetimes
  - Transient: Creates an instance once every time it is requested
  - Scoped (what I am using): Creates an instance once per unit of work. If multiple processes are running at the same time, it can share the same ___
  - Singleton: Creates an instance once per app. Can slow down app depending on usage.
