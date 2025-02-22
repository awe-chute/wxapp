``` mermaid
graph TD;
    
    C[Client]
    C -- GET, POST, DELETE --> D[Plants Microservice]

    D -- PlantAdded, PlantList --> E[EventBus Microservice]
    E --> F[Calculation Microservice]
    G[Precipitation Microservice]
    G -- PrecipitationUpdate --> E

    G -- GET --> H[External API]
```
