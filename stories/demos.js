import React from "react";
import styled from "styled-components";
import Floodgate from "floodgate";
import {
	generateFilledArray,
	generateLoremIpsum as LI,
	theOfficeData
} from "helpers";

const Main = styled.main`
	color: #333;
	font-family: "Open Sans", "Roboto", "Arial", sans-serif;
`;

const LoadMore = styled.button`
	background-color: palevioletred;
	border: 0px solid transparent;
	color: #fff;
	cursor: pointer;
	display: inline-block;
	font-size: 24px;
	padding: 1em 0;
	text-align: center;
	width: 66%;
`;

const LoadAll = styled(LoadMore)`
	background-color: lightseagreen;
	display: inline-block;
	width: 34%;
`;

const Reset = styled(LoadMore)`
	background-color: lightgoldenrodyellow;
	color: #333;
	display: block;
	width: 100%;
`;

const LoadsArticles = () => {
	return (
		<Floodgate
			data={generateFilledArray(15).map(n => {
				const title = LI({ count: 8 });
				const content = LI({ count: 55, units: "words" });
				return {
					id: title
						.toLowerCase()
						.replace(/[\s\-\_]+/g, "_")
						.substr(0, 16)
						.replace(/\_$/g, ""),
					title,
					content
				};
			})}
		>
			{({ items, loadNext, loadAll, loadComplete, reset }) => (
				<Main>
					{items.map((article, i, allArticles) => (
						<article
							key={article.id}
							style={{ margin: "1.5em auto" }}
							id={
								i !== 0 && i === allArticles.length - 1
									? "last"
									: i === 0 ? "first" : null
							}
						>
							<h2 style={{ textTransform: "capitalize" }}>{article.title}</h2>
							<p style={{ lineHeight: 1.5 }}>
								{article.content.length > 360
									? `${article.content.substr(0, 359)}…`
									: `${article.content}.`}
							</p>
						</article>
					))}
					{(!loadComplete && (
						<span>
							<LoadMore
								onClick={() =>
									loadNext({ callback: s => (window.location = "#last") })}
							>
								Load More
							</LoadMore>
							<LoadAll
								onClick={() =>
									loadAll({ callback: s => (window.location = "#last") })}
							>
								Load All
							</LoadAll>
						</span>
					)) || (
						<Reset
							onClick={() =>
								reset({ callback: s => (window.location = "#first") })}
						>
							Reset
						</Reset>
					)}
				</Main>
			)}
		</Floodgate>
	);
};

const LoadsCards = () => {
	const CardWrapper = styled.section`
		margin: 1em auto;
		display: flex;
		flex-wrap: wrap;
		@supports (display: grid) {
			display: grid;
			grid-template-columns: repeat(1, calc(100%));
			grid-gap: 0.5em;
			@media only screen and (min-width: 600px) {
				grid-template-columns: repeat(2, calc(50% - 0.2em));
			}
			@media only screen and (min-width: 940px) {
				grid-template-columns: repeat(3, calc(33% - 0.2em));
			}
		}
	`;

	const Card = styled.article`
		background-color: #efefef;
		margin: 0.5em;
		text-align: center;
		width: 100%;
		@media only screen and (min-width: 600px) {
			width: calc(50% - 1em);
		}
		@media only screen and (min-width: 940px) {
			width: calc(33% - 1em);
		}
		@supports (display: grid) {
			margin: auto;
			width: 100%;
			min-width: none;
		}
	`;

	const Name = styled.h2`
		font-size: 18px;
		font-weight: 600;
		margin: 1em auto 0.25em;
		text-shadow: 1px 1px #ddd;
	`;

	const Email = styled.p`
		color: #aaa;
		font-size: 12px;
		margin: 0 auto 1em;
	`;

	const Status = styled(Email)`
		color: ${({ isActive }) => (isActive ? "#11ca12" : "#ca1211")};
		font-weight: 600;
	`;
	return (
		<Floodgate data={theOfficeData} initial={3} increment={3}>
			{({ items, loadNext, loadAll, loadComplete, reset }) => (
				<Main>
					<h1 style={{ textAlign: "center" }}>The Office Rolodex</h1>
					<CardWrapper>
						{items.map(character => (
							<Card key={character.name}>
								<Name>{character.name}</Name>
								<Email>{character.email}</Email>
								<Status isActive={character.status}>
									{character.status ? "ACTIVE" : "INACTIVE"}
								</Status>
							</Card>
						))}
					</CardWrapper>
					{(!loadComplete && (
						<span>
							<LoadMore onClick={loadNext}>More</LoadMore>
							<LoadAll onClick={loadAll}>All</LoadAll>
						</span>
					)) || <Reset onClick={reset}>Reset</Reset>}
				</Main>
			)}
		</Floodgate>
	);
};

export { LoadsArticles, LoadsCards };
