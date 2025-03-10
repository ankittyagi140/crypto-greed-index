import { useState } from 'react';

interface FAQItemProps {
  title: string;
  description: string;
}

function FAQItem({ title, description }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        className="w-full py-4 flex items-center justify-between text-left cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">{title}</h3>
        <span className={`transform transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            className="text-gray-600 dark:text-gray-400"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const faqs = [
    {
      title: "What Is Crypto Fear and Greed Index",
      description: "The ups and downs of the crypto market can be quite steep and it's not rare for investors to get discouraged. The Crypto Fear and Greed Index makes an assessment of the dominant mood on the market, so the psychological factor is also taken into account.\n\nThe atmosphere of Fear, for example, drives many investors to panic and sell their crypto assets. This is a potential buying opportunity.\n\nWhile the times of Greed, on the contrary, foster a certain recklessness in investment decisions. Potentially, they indicate that the market will be down soon.\n\nChecking the index to find out where we currently stand psychologically is a good way to avoid common pitfalls and make wiser investment decisions – decisions that will pass the test of time."
    },
    {
      title: "How Is Fear & Greed Calculated",
      description: "The volatile crypto market is in fact guided by the psychological currents running underneath it. So, how do we go about calculating the fear & greed in the air? The psychological backdrop of the crypto market finds its reflection in a number of mediums, from social media posts to Google Trends.\n\nThe market itself, when interpreted in combination with data from those outside mediums, can tell us a lot about the investing environment. Our Fear & Greed Index takes into account all those factors and, assigning them respective weight, molds them into one unified result."
    },
    {
      title: "How to Use Fear and Greed Index or What to Use It For",
      description: "If you're about to make an investment decision, but are unsure just how much that decision is affected by the general atmosphere of Fear or Greed on the market, checking the index can be quite helpful.\n\nThe Fear Index era is all about selling, so valuable assets are sometimes \"thrown out with the bathwater.\" In contrast, the Greed Index era is characterized by careless investments in assets the value of which is overblown.\n\nThe Fear and Greed Index is just another tool to support your decision-making process."
    },
    {
      title: "How Often Do We Update Crypto Fear and Greed Index",
      description: "We update the Crypto Fear and Greed Index every 12 hours."
    }
  ];

  const factors = [
    {
      title: "Current Volatility (25%)",
      description: "A rise in volatility contributes to the rise of fear in the market. To measure the volatility, we make respective comparisons to the average volatility value of Bitcoin in the previous 30 and 90 days. On the other hand, if we notice that volatility is falling, we assume the market's general mood is shifting more toward Greed."
    },
    {
      title: "Momentum/Volume of the Market (25%)",
      description: "When we see that the buying volumes are unusually high in the market, we conclude that there is an atmosphere of greed. The way we calculate the momentum/market volume is similar to the way we calculate the previous factor: We compare the current stats to the average of the last 30 days and 90 days."
    },
    {
      title: "Social Media Posts (15%)",
      description: "Monitoring hashtags of various coins on Twitter, we conclude that there is a tilt toward Greed when the hashtags get high interaction rates. It means interest in this or that coin is on the rise. On the contrary, when those numbers are falling, we assume the market is entering Fear territory."
    },
    {
      title: "Surveys (15%)",
      description: "Asking people what they think of the crypto market directly is quite effective. That's why surveys are yet another aspect of the Fear & Greed Index. Typically, each survey gets anywhere between 2000 and 3000 votes."
    },
    {
      title: "Bitcoin Dominance (10%)",
      description: "If the dominance of Bitcoin is rising, that means that people are cautious about their crypto choices. In the atmosphere of Greed, investors are more open to experimenting with altcoins, as they hope one of those coin will make it big. On the other hand, in the times of Fear, they tend to stick with what they know, limiting risk."
    },
    {
      title: "Google Trends (10%)",
      description: "The data about the search queries of users regarding Bitcoin can tell us a lot about the general atmosphere in the market. For example, if a growing number of queries include \"Bitcoin price manipulation,\" we interpret this as a sign of fear. On the other hand, if queries such as \"How to buy crypto\" are becoming more frequent, we're in for Greedy times."
    }
  ];

  return (
    <div className="space-y-12">
      {/* FAQs Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            FAQs about Fear & Greed Index
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Find out more about the Fear & Greed Index and how it's calculated before adding it to your toolset.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} title={faq.title} description={faq.description} />
          ))}
        </div>
      </div>

      {/* Factors Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            What Does Fear & Greed Index Take Into Account
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Here are all the factors that contribute to the Index:
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {factors.map((factor, index) => (
            <FAQItem key={index} title={factor.title} description={factor.description} />
          ))}
        </div>
      </div>
    </div>
  );
} 