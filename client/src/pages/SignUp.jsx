import { Link, useNavigate } from "react-router-dom";
import { useReducer } from "react";
import OAuth from "../components/OAuth";

const initialState = {
  formData: {
    username: "",
    email: "",
    password: "",
  },
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "formData":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.id]: action.payload.value,
        },
      };
    case "submit":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "success":
      return {
        ...state,
        loading: false,
      };
    case "failure":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action type!!!");
  }
}

export default function SignUp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { formData, loading, error } = state;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: "submit" });
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      dispatch({ type: "success" });
      navigate("/sign-in");
    } catch (err) {
      dispatch({ type: "failure", payload: err.message });
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    dispatch({ type: "formData", payload: { id, value } });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
