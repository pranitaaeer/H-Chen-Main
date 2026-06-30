import React from "react";

export default function ShippingPolicy() {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-6">
          <h1
            className=" mb-5"
            style={{
              fontSize: "3rem",
              fontWeight: "400",
            }}
          >
            Shipping Policy
          </h1>

          <h2
            className="mb-3"
            style={{
              fontSize: "1.5rem",
              fontWeight: "400",
            }}
          >
            A legal disclaimer
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              color: "#333",
              fontFamily: "'Geo', serif",
              fontWeight: "bold",
            }}
          >
            The explanations and information provided on this page are only
            general and high-level explanations and information on how to write
            your own document of a Shipping Policy. You should not rely on this
            article as legal advice or as recommendations regarding what you
            should actually do, because we cannot know in advance what are the
            specific shipping policies that you wish to establish between your
            business and your customers. We recommend that you seek legal advice
            to help you understand and to assist you in the creation of your own
            Shipping Policy.
          </p>

          <h2
            className="mt-5 mb-3"
            style={{
              fontSize: "1.5rem",
              fontWeight: "400",
            }}
          >
            Shipping Policy - the basics
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              color: "#333",
              fontFamily: "'Geo', serif",
              fontWeight: "bold",
            }}
          >
            Having said that, a Shipping Policy is a legally binding document
            that is meant to establish the legal relations between you and your
            customers. It is the legal framework for presenting your obligations
            to your customers, but also to address different possible scenarios
            that may occur, and what happens in each and every case. <br></br>{" "}
            <br></br> A Shipping Policy is a good practice and it helps both
            sides - you and your customers. Your customers may benefit from
            being informed about what they can expect from your service. You may
            benefit because people may be likely to shop with you if you have a
            clear Shipping Policy in place since there won't be any questions
            about your shipping timeframes or processes.
          </p>

          <h2
            className="mt-5 mb-3"
            style={{
              fontSize: "1.5rem",
              fontWeight: "400",
            }}
          >
            What to include in the Shipping Policy
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.7",
              color: "#333",
              fontFamily: "'Geo', serif",
              fontWeight: "bold",
            }}
          >
            Generally speaking, a Shipping Policy often addresses these types of
            issues: the timeframe for processing orders; the shipping costs;
            different domestic and international shipping solutions; potential
            service interruptions; and much, much more.
          </p>
        </div>
      </div>
    </div>
  );
}
