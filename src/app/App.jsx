import React, { lazy, Suspense , useEffect , useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import NotificationBell from "../components/parts/NotificationsBell";
import CustomToaster from "../components/tools/CustomToaster";
import userContext from '../components/contexts/userContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Correct 
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import LoadingSpinner from "../components/tools/LoadingSpinner";
import ProtectedRoute from "../components/tools/ProtectedRoute";
import NotAuthRoute from "../components/tools/NoAuthRoute";
import { GoogleOAuthProvider } from '@react-oauth/google';




// Lazy-load the components
const MainPage = lazy(() => import("../pages/MainPage"));
const SavedPage = lazy(() => import("../pages/SavedPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const SavedPostsCollections = lazy (()=> import("../components/saved/saved-posts/SavedPostsCollections"))
const CollectionPosts = lazy (()=> import("../components/saved/saved-posts/CollectionPosts"))
const PostPage = lazy (()=> import("../pages/PostPage"))
const DemandsPage = lazy (()=> import("../pages/DemandsPage"))
const AuthPage = lazy (()=> import("../pages/AuthPage"))
const Header =  lazy (()=> import("../components/parts/Header"))
const TestPage = lazy (()=> import("../components/test/TestPage"))  





const queryClient = new QueryClient();

export default function App() {
  // const [forceRefetch, setForceRefetch] = useState(false);
  const [user, setUser] = useState({ id: 0, username: '', email: '' });

  useEffect(() => {
    const storedData = localStorage.getItem('token');
    if (storedData) {
      setUser(JSON.parse(storedData).user);
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId="675057642420-lp56bgvp9pphu20b562vuf6kpndvn75p.apps.googleusercontent.com">

    <userContext.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <CustomToaster />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<NotAuthRoute><AuthPage /></NotAuthRoute>} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/post/:postId" element={<PostPage />} />

              <Route 
                path="/*" 
                element={
                  
                  <ProtectedRoute>
                    <Header /> 
                    {/* <NotificationBell/> */}
                    <Routes>
                      <Route path="/" element={<MainPage />} />
                      <Route path="/saved" element={<SavedPage />} />
                      <Route path="/:username" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/demands" element={<DemandsPage />} />
                      <Route path="/saved/posts/collections" element={<SavedPostsCollections />} />
                      <Route path="/saved/posts/collection/:collection" element={<CollectionPosts />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </userContext.Provider>
    </GoogleOAuthProvider>
  );
}
