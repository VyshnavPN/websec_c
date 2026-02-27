import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      © {new Date().getFullYear()} WebSec. All rights reserved.
    </footer>
  );
}

const styles = {
  footer: {
    padding: "20px",
    textAlign: "center",
    color: "#777",
    background: "#000",
  },
};
