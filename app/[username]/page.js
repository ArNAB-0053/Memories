import Profile from "@/components/profile";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username); // Decode username

  return {
    title: `${decodedUsername || "Profile"}`,
    description: "Login to your account",
  };
}

const ProfilePage = async ({ params }) => {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).replace(/^@/, "");  

  return (
    <Profile username={decodedUsername} />
  );
};

export default ProfilePage;
