import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Link from "next/link";
const UserIndex = () => (
  <Layout>
    <Private>
      <h2>User Dasboard</h2>
    </Private>
  </Layout>
);

export default UserIndex;
