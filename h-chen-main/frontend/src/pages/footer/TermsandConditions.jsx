import React from "react";

export default function TermsandConditions() {
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
            Terms & Conditions
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
            your own document of Terms & Conditions. You should not rely on this
            article as legal advice or as recommendations regarding what you
            should actually do, because we cannot know in advance what are the
            specific terms you wish to establish between your business and your
            customers and visitors. We recommend that you seek legal advice to
            help you understand and to assist you in the creation of your own
            Terms & Conditions.
          </p>

          <h2
            className="mt-5 mb-3"
            style={{
              fontSize: "1.5rem",
              fontWeight: "400",
            }}
          >
            Terms & Conditions - the basics
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
            Having said that, Terms and Conditions (“T&C”) are a set of legally
            binding terms defined by you, as the owner of this website. The T&C
            set forth the legal boundaries governing the activities of the
            website visitors, or your customers, while they visit or engage with
            this website. The T&C are meant to establish the legal relationship
            between the site visitors and you as the website owner. <br></br>{" "}
            <br></br>T&C should be defined according to the specific needs and
            nature of each website. For example, a website offering products to
            customers in e-commerce transactions requires T&C that are different
            from the T&C of a website only providing information (like a blog, a
            landing page, and so on). <br></br>
            <br></br> T&C provide you as the website owner the ability to
            protect yourself from potential legal exposure, but this may differ
            from jurisdiction to jurisdiction, so make sure to receive local
            legal advice if you are trying to protect yourself from legal
            exposure.
          </p>

          <h2
            className="mt-5 mb-3"
            style={{
              fontSize: "1.5rem",
              fontWeight: "400",
            }}
          >
            What to include in the T&C document
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
            Generally speaking, T&C often address these types of issues: Who is
            allowed to use the website; the possible payment methods; a
            declaration that the website owner may change his or her offering in
            the future; the types of warranties the website owner gives his or
            her customers; a reference to issues of intellectual property or
            copyrights, where relevant; the website owner’s right to suspend or
            cancel a member’s account; and much, much more.
          </p>
        </div>
      </div>
    </div>
  );
}
