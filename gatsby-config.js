module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "heycoddes",
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/global/icon.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "global",
        path: "./src/images/global",
      },
      __key: "global",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "workPreview",
        path: "./src/images/workPreview/",
      },
      __key: "workPreview",
    },
  ],
};
