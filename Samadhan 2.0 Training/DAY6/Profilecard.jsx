import React from 'react';


const ProfileCard = ({ name, title, bio, imageUrl }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-auto my-12 transition-all duration-300 transform hover:scale-105">
      <div className="flex justify-center mb-6">
        <img
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md transition-transform duration-300 hover:rotate-6"
          src={imageUrl}
          alt={`Profile picture of ${name}`}
        />
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2 font-inter">{name}</h2>
        <p className="text-sm font-semibold text-blue-600 mb-4 uppercase tracking-widest font-inter">{title}</p>
        <p className="text-gray-600 leading-relaxed font-light font-inter">{bio}</p>
      </div>
    </div>
  );
};

const App = () => {
  const userProfile = {
    name: "Amritanshu Tiwari",
    title: "Java Full stack Developer",
    bio: "Passionate about creating intuitive and beautiful user experiences. Specializing in design and prototyping for web applications.",
    imageUrl: "https://placehold.co/128x128/ADD8E6/000000?text=AT"
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-inter">
      <script src="https://cdn.tailwindcss.com"></script>
      <div className="p-4 w-full">
        {/* Render the ProfileCard with props */}
        <ProfileCard
          name={userProfile.name}
          title={userProfile.title}
          bio={userProfile.bio}
          imageUrl={userProfile.imageUrl}
        />
      </div>
    </div>
  );
};

export default App;
