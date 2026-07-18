// src/routes.ts

import TodoListView from './views/TodoListView';
import AllViews from './views/AllView';
import GroupedListsView from './views/GroupedListsView';
// import PromptsView from './views/PromptsView';
// import ExcalidrawView from './views/ExcalidrawView';
import FilterView from './views/FilterView';
import ChatView from './views/ChatView';
import InsightsView from './views/InsightsView';

export const appRoutes = [
  { path: '/', label: 'Todos', element: <TodoListView /> },
  // { path: '/todos', label: 'Todos', element: <TodoListView /> }, // todo this is kind of weird having home hidden and this idk
    
   { path: '/lists', label: 'Grouped Lists', element: <GroupedListsView /> },
  { path: '/filter', label: 'Filter', element: <FilterView /> },
  { path: '/chat', label: 'Chat', element: <ChatView /> },
     
  { path: '/insights', label: 'Insights', element: <InsightsView /> },
  // { path: '/prompts', label: 'Prompts', element: <PromptsView /> },
  // { path: '/tracker', label: 'Tracker', element: <TrackerView /> },
  // ExcalidrawView
  { path: '/all', label: 'All', element: <AllViews /> },
];
