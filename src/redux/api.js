import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "../utils/constant";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    verifyKey: builder.query({
      query: ({ apiKey }) => {
        return {
          url: `reference/verify_key?api_key=${apiKey}`,
          method: "GET",
        };
      },
    }),

    getSessions: builder.query({
      query: ({ system_id }) => ({
        url: `session/get_user_sessions?system_id=${system_id}`,
        method: "GET",
      }),
    }),

    getChatHistory: builder.query({
      query: ({ session_id }) => ({
        url: `/chat/chat_history?session_id=${session_id}`,
        method: "GET",
      }),
    }),

    createSession: builder.mutation({
      query: (body) => ({
        url: "/session/create_session",
        method: "POST",
        body: body,
      }),
    }),

    sessionDetails: builder.mutation({
      query: (body) => ({
        url: "/session/session_details",
        method: "PUT",
        body: body,
      }),
    }),

    deleteChat: builder.mutation({
      query: (body) => ({
        url: "/chat/delete_chat",
        method: "DELETE",
        body: body,
      }),
    }),
  }),
});

export const {
  useVerifyKeyQuery,
  useGetSessionsQuery,
  useGetChatHistoryQuery,
  useCreateSessionMutation,
  useSessionDetailsMutation,
  useDeleteChatMutation,
} = api;
