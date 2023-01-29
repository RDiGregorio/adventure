import {sleep} from 'shared/src/util/async';
import './app.css';
import React from "react";

export default class App extends React.Component {
    render() {
        const rows = [];

        function f() {
            // await sleep(1000);
            for (let y = 0; y < 10; y++) {
                const row = [];

                for (let x = 0; x < 10; x++)
                    row.push(<span>💀1</span>);

                rows.push(<div>{row}</div>);
            }
        }

        f();

        return (<div className="noto-emoji">{rows}</div>);
    }
}