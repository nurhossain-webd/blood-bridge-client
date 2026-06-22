"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import axiosPublic from "@/lib/axiosPublic";
import { authClient } from "@/lib/auth-client";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const districts = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Savar"],
  Chattogram: ["Pahartali", "Kotwali", "Halishahar"],
  Sylhet: ["Sylhet Sadar", "Beanibazar", "Zakiganj"],
  Rajshahi: ["Boalia", "Paba", "Godagari"],
};

export default function RegisterForm() {
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const uploadImageToImgbb = async (imageFile) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey || apiKey === "your_imgbb_api_key_here") {
      throw new Error("ImageBB API key is missing in .env.local");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const response = await axios.post(imageUploadUrl, formData);

    return response.data.data.url;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let avatarUrl = "";

      if (data.avatar?.[0]) {
        avatarUrl = await uploadImageToImgbb(data.avatar[0]);
      }

      const { data: authData, error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: avatarUrl,
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      const userInfo = {
        name: data.name,
        email: data.email,
        avatar: avatarUrl,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
      };

      await axiosPublic.post("/users", userInfo);

      toast.success("Registration successful");
      reset();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl md:p-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-red-700 md:text-4xl">
          Join BloodBridge
        </h1>
        <p className="mt-3 text-gray-600">
          Create your donor account and help save lives.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">Avatar</label>
          <input
            type="file"
            accept="image/*"
            {...register("avatar", { required: "Avatar is required" })}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
          {errors.avatar && (
            <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Blood Group
          </label>
          <select
            {...register("bloodGroup", { required: "Blood group is required" })}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">Select blood group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.bloodGroup && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bloodGroup.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">District</label>
          <select
            {...register("district", { required: "District is required" })}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">Select district</option>
            {Object.keys(districts).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-sm text-red-600">
              {errors.district.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">Upazila</label>
          <select
            {...register("upazila", { required: "Upazila is required" })}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">Select upazila</option>
            {selectedDistrict &&
              districts[selectedDistrict]?.map((upazila) => (
                <option key={upazila} value={upazila}>
                  {upazila}
                </option>
              ))}
          </select>
          {errors.upazila && (
            <p className="mt-1 text-sm text-red-600">
              {errors.upazila.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
            placeholder="Minimum 8 characters"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Password did not match",
            })}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-red-700">
          Login
        </Link>
      </p>
    </section>
  );
}