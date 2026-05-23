// ==UserScript==
// @name         AtCoder JP Immersion
// @namespace    https://github.com/lirrnaiad/atcoder-jp-immersion
// @version      1.0.0
// @description  A utility for immersing in Japanese with AtCoder
// @author       lirrnaiad
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const STORAGE_KEY = "atcoderJpImmersionMode";

    function getPageLanguage() {
        const meta = document.querySelector('meta[http-equiv="Content-Language"]');

        if (!meta) {
            return "unknown";
        }

        return meta.getAttribute("content") || "unknown";
    }

    function isImmersionModeOn() {
        return localStorage.getItem(STORAGE_KEY) === "true";
    }

    function setImmersionMode(value) {
        localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
    }

    function findLanguageDropdown() {
        const dropdowns = document.querySelectorAll("ul.nav.navbar-nav.navbar-right > li.dropdown");

        for (const dropdown of dropdowns) {
            const text = dropdown.textContent;

            if (text.includes("日本語") || text.includes("English")) {
                return dropdown;
            }
        }

        return null;
    }

    function updateLanguageDropdownVisibility() {
        const pageLanguage = getPageLanguage();
        const languageDropdown = findLanguageDropdown();

        if (!languageDropdown) {
            return;
        }

        if (pageLanguage === "ja" && isImmersionModeOn()) {
            languageDropdown.style.display = "none";
        } else {
            languageDropdown.style.display = "";
        }
    }

    function createToggleButton() {
        const pageLanguage = getPageLanguage();

        if (pageLanguage !== "ja") {
            return;
        }

        const navbarRight = document.querySelector("ul.nav.navbar-nav.navbar-right");
        const languageDropdown = findLanguageDropdown();

        if (!navbarRight || !languageDropdown) {
            return;
        }

        const listItem = document.createElement("li");
        const button = document.createElement("button");

        button.type = "button";
        button.style.marginTop = "8px";
        button.style.marginRight = "8px";
        button.style.padding = "6px 10px";
        button.style.border = "1px solid #666";
        button.style.borderRadius = "4px";
        button.style.background = "#222";
        button.style.color = "#fff";
        button.style.fontSize = "13px";

        function refreshButtonText() {
            if (isImmersionModeOn()) {
                button.textContent = "JP Immersion: ON";
                button.style.background = "#1f6f3f";
            } else {
                button.textContent = "JP Immersion: OFF";
                button.style.background = "#222";
            }
        }

        button.addEventListener("click", function () {
            const nextState = !isImmersionModeOn();

            setImmersionMode(nextState);
            refreshButtonText();
            updateLanguageDropdownVisibility();
        });

        refreshButtonText();

        listItem.appendChild(button);
        navbarRight.insertBefore(listItem, languageDropdown);
    }

    createToggleButton();
    updateLanguageDropdownVisibility();
})();
