import {
    AnyAction,
    configureStore,
    EnhancedStore
   } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { AppDispatch } from "../../store";
import { selectTodo, fetchTodo } from "../../store/slices/todo";
import axios from "axios";
import { TodoState } from "../../store/slices/todo";
import { getMockStore } from "../../test-utils/mocks";

const fakeid = {number:0};

const stubInitialState: TodoState = {
    todos: [
     { id: 1, title: "TODO_TEST_TITLE_1", content: "TODO_TEST_CONTENT_1", done: false },
     { id: 2, title: "TODO_TEST_TITLE_2", content: "TODO_TEST_CONTENT_2", done: false },
     { id: 3, title: "TODO_TEST_TITLE_3", content: "TODO_TEST_CONTENT_3", done: false },
     ],
    selectedTodo: null,
    };

const mockStore = getMockStore({ todo: stubInitialState });