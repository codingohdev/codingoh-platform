"use client";

import React, { useState, Fragment, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { FaCirclePlus, FaGithub } from "react-icons/fa6";
import { Dialog, Transition } from "@headlessui/react";
import { Tag, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { projects } from "@/dummy/questions";
import { Project as ProjectType } from "@/types";
import Avatar from "@/public/avatar.png";
import sortedIcons from "@/utils/icons";

const getBgColor = (status: string): string => {
  switch (status) {
    case "ongoing":
      return "bg-amber-100";
    case "completed":
      return "bg-green-100";
    case "on_hold":
      return "bg-orange-100";
    default:
      return "bg-white";
  }
};

const Project = ({ project }: { project: ProjectType }) => {
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; [key: string]: any }>();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        console.error("User not found:", error);
      }
    };
    fetchUser();
  });

  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [projectImage, setProjectImage] = useState<string>("");

  // setProjectImage(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/projImage-${user.id}`);

  useEffect(() => {
    const fetchProjectImage = async () => {
      setProjectImage(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projectImages/projImage-${project.id}`
      );
    };
    fetchProjectImage();
  });

  return (
    <>
      <article
        className={`overflow-hidden rounded-lg min-h-[350px] border border-gray-200 ${getBgColor(
          project.status
        )} shadow-sm cursor-pointer`}
        onClick={() => setIsProjectModalOpen(true)}
      >
        <img
          alt="Office"
          src={
            project.project_image
              ? projectImage
              : "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          }
          className="h-56 w-full object-cover"
        />
        <div
          className={`p-4 flex flex-col justify-between flex-grow ${getBgColor(
            project.status
          )}`}
        >
          <div className="bg-inherit">
            <h3
              className={`text-lg font-medium text-gray-900 ${getBgColor(
                project.status
              )}`}
              onClick={() => setIsProjectModalOpen(true)}
            >
              {project.name}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500 bg-inherit">
              {project.description}
            </p>
          </div>

          <div
            className={`flex justify-between ${
              project.github
                ? "justify-items-end items-end"
                : "justify-items-end items-center"
            } ${getBgColor(project.status)}`}
          >
            <Link
              href={`/users/${project.owner?.auth_id}`}
              className="bg-inherit text-sm hover:underline"
            >
              {`${project.owner?.first_name} ${project.owner?.last_name}`}
            </Link>
            {project.github && (
              <Link
                href={
                  project.github.startsWith("https://")
                    ? project.github
                    : `https://${project.github}`
                }
              >
                <FaGithub
                  className={`${getBgColor(
                    project.status
                  )} h-7 w-7 hover:scale-150 transition duration-300`}
                />
              </Link>
            )}
          </div>
        </div>
      </article>

      <Transition appear show={isProjectModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 overflow-auto"
          onClose={() => setIsProjectModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-400/75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-4/6 max-w-full transform overflow-auto rounded-2xl border-slate-200 border border-solid p-6 shadow-xl transition-all ${getBgColor(
                    project.status
                  )}`}
                >
                  <img
                    alt="Office"
                    src={
                      project.project_image
                        ? projectImage
                        : "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                    }
                    className="h-[300px] w-full object-cover mb-4 rounded-t-2xl border border-solid border-gray-700"
                  />
                  <Dialog.Title
                    as="h1"
                    className="flex justify-between items-center p-2 text-4xl font-bold leading-6 text-gray-900 text-left"
                  >
                    <div className="flex flex-row items-end gap-3">
                      {project.name}{" "}
                      {user?.id === project.owner?.auth_id && (
                        <Link href={`/projects/${project.id}/edit`}>
                          <FaEdit className="text-base hover:text-blue-600 hover:cursor-pointer" />
                        </Link>
                      )}
                    </div>
                    {project.github && (
                      <Link
                        href={
                          project.github.startsWith("https://")
                            ? project.github
                            : `https://${project.github}`
                        }
                      >
                        <FaGithub
                          className={`${getBgColor(
                            project.status
                          )} h-7 w-7 hover:scale-150 transition duration-300`}
                        />
                      </Link>
                    )}
                  </Dialog.Title>
                  <Link
                    href={`/users/${project.owner?.auth_id}`}
                    className="text-left"
                  >
                    <div className="text-left">
                      <span className="p-2 text-sm hover:underline hover:cursor-pointer hover:text-blue-500">
                        {`${project.owner?.first_name} ${project.owner?.last_name}`}
                      </span>
                    </div>
                  </Link>
                  <p className="py-4 px-2 text-base leading-6 text-left">
                    {project.description}
                  </p>
                  {project.stack && (
                    <>
                      <h2 className="pl-2 mt-2 font-bold text-left text-xl">
                        Tech Stack
                      </h2>
                      <div className="grid grid-cols-16 p-2 gap-3">
                        {project.stack?.map((item) => (
                          <Tooltip title={item}>{sortedIcons[item]}</Tooltip>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-start">
                    {project.skills && (
                      <div>
                        <h2 className="pl-2 mt-2 font-bold text-left text-xl">
                          Needed Skills
                        </h2>
                        <div
                          id="project-tags"
                          className="p-2 gap-2 flex justify-start items-start flex-wrap"
                        >
                          {project.skills?.map((item) => (
                            <Tag bordered={false}>{item}</Tag>
                          ))}
                        </div>
                      </div>
                    )}
                    {project.application && (
                      <div>
                        <Link href="/" target="_blank">
                          <FaCirclePlus className="hover:text-blue-700 hover:cursor-pointer text-4xl" />
                        </Link>
                      </div>
                    )}
                  </div>
                  {/* <h1 className="px-2 mt-4 font-bold text-left text-2xl flex flex-row justify-between items-center">
                    Contributors
                    <Link href="/" target="_blank">
                      <FaCirclePlus className="hover:text-blue-700 hover:cursor-pointer text-4xl" />
                    </Link>
                  </h1>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <div
                      key={num}
                      className="p-2 mt-2 flex justify-between items-center"
                    >
                      <div className="flex justify-start items-center gap-5 basis-1/2">
                        <Image
                          src={Avatar}
                          alt="profile picture"
                          className="h-[10%] w-[10%] rounded-full"
                        />
                        <div className="text-lg">Immanuel Peter</div>
                      </div>
                      <div className="basis-1/2 justify-end items-center flex flex-row gap-3">
                        {project.stack?.map((item) => sortedIcons[item])}
                      </div>
                    </div>
                  ))} */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Project;

/*
<Dialog.Title
                    as="h1"
                    className="p-2 text-4xl font-bold leading-6 text-gray-900 underline underline-offset-auto"
                  >
                    
                  </Dialog.Title>
*/
