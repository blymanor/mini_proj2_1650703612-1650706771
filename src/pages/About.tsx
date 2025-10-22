import React from "react";

const About = () => (
  <div className="p-4 md:p-8 max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
    <p className="text-lg text-center mb-8">
      This Recipe Shelf application was created by passionate developers who
      love food and coding.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body items-center text-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src="https://placehold.co/100x100/3498db/ffffff?text=P"
                alt="Pleng"
              />
            </div>
          </div>
          <h2 className="card-title mt-4">Tipparida Rujisunkuntorn</h2>
          <p>Student ID: 1650706771</p>
          <p>
            Frontend specialist with a love for React and clean UI. Enjoys
            cooking Thai food on weekends.
          </p>
          <p>Email: tipparida.ruj@bumail.net</p>
        </div>
      </div>
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body items-center text-center">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
              <img
                src="https://placehold.co/100x100/e74c3c/ffffff?text=I"
                alt="Ing"
              />
            </div>
          </div>
          <h2 className="card-title mt-4">Ingnop Khunra</h2>
          <p>Student ID: 1650703612</p>
          <p>
            State management guru who ensures the app runs smoothly. Expert in
            baking sourdough bread.
          </p>
          <p>Email: ingnop.khun@bumail.net</p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
