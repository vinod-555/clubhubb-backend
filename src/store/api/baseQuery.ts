// baseQuery.ts

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:8000/" }); 
// export const baseQuery = fetchBaseQuery({ baseUrl: "https://clubhub-user-backend.onrender.com/" }); 


