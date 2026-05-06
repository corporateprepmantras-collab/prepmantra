import { connectMongoDB } from '@/lib/mongo';
import Product from '@/models/productListSchema';

export async function GET(req) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return new Response(JSON.stringify({ 
        message: 'Product ID is required' 
      }), { status: 400 });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ 
        message: 'Product not found' 
      }), { status: 404 });
    }
    
    return new Response(JSON.stringify({
      faqs: product.faqs || []
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ 
      message: 'Server error', 
      error: error.message 
    }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongoDB();
    
    const { productId, question, answer } = await req.json();
    
    if (!productId || !question || !answer) {
      return new Response(JSON.stringify({ 
        message: 'All fields are required' 
      }), { status: 400 });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ 
        message: 'Product not found' 
      }), { status: 404 });
    }
    
    product.faqs.push({ question, answer });
    await product.save();
    
    return new Response(JSON.stringify({ 
      message: 'FAQ added successfully',
      faq: product.faqs[product.faqs.length - 1]
    }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ 
      message: 'Server error', 
      error: error.message 
    }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectMongoDB();
    
    const { productId, faqId, question, answer } = await req.json();
    
    if (!productId || !faqId || !question || !answer) {
      return new Response(JSON.stringify({ 
        message: 'All fields are required' 
      }), { status: 400 });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ 
        message: 'Product not found' 
      }), { status: 404 });
    }
    
    const faq = product.faqs.id(faqId);
    if (!faq) {
      return new Response(JSON.stringify({ 
        message: 'FAQ not found' 
      }), { status: 404 });
    }
    
    faq.question = question;
    faq.answer = answer;
    await product.save();
    
    return new Response(JSON.stringify({ 
      message: 'FAQ updated successfully'
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ 
      message: 'Server error', 
      error: error.message 
    }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const faqId = searchParams.get('faqId');
    
    if (!productId || !faqId) {
      return new Response(JSON.stringify({ 
        message: 'Product ID and FAQ ID are required' 
      }), { status: 400 });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ 
        message: 'Product not found' 
      }), { status: 404 });
    }
    
    product.faqs.pull(faqId);
    await product.save();
    
    return new Response(JSON.stringify({ 
      message: 'FAQ deleted successfully'
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ 
      message: 'Server error', 
      error: error.message 
    }), { status: 500 });
  }
}