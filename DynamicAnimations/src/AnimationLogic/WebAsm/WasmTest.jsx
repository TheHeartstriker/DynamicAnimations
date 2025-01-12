import React, { useEffect, useState } from "react";
import init from "./add.wasm?init";

const WasmTest = () => {
  const loadWasm = async () => {
    const wasm = await init({
      wasi_snapshot_preview1: {
        proc_exit: (code) => {
          console.log(`WASM exited with code ${code}`);
        },
      },
    });

    console.log("19 + 3 =", wasm.exports.add(19, 3));
  };

  loadWasm();
};

export default WasmTest;
