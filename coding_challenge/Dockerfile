# Use the official .NET image as a build environment\
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

WORKDIR /app

# Copy everything and restore as distinct layers
COPY . ./
RUN dotnet restore

# Build the app
RUN dotnet publish -c Release -o out

# Use the official .NET runtime image for production
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Expose the port the app runs on
ENV ASPNETCORE_URLS=http://+:7298
EXPOSE 7298

# Set the entry point for the application
ENTRYPOINT ["dotnet", "coding_challenge.dll"]