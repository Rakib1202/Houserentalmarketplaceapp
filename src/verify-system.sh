#!/bin/bash

# HouseRentBD System Startup Verification Script
# Run this to check if everything is configured correctly

echo "🔍 HouseRentBD System Verification"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
PASS=0
FAIL=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 exists"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} $1 is missing"
        ((FAIL++))
        return 1
    fi
}

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${GREEN}✅${NC} Port $1 is active"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} Port $1 is not active"
        ((FAIL++))
        return 1
    fi
}

# Function to check MongoDB
check_mongodb() {
    if mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} MongoDB is running"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} MongoDB is not running"
        echo -e "   ${YELLOW}Start with:${NC} brew services start mongodb-community@7.0"
        ((FAIL++))
        return 1
    fi
}

# Function to check API health
check_api() {
    if curl -s http://localhost:5000/api/health | grep -q "OK" 2>&1; then
        echo -e "${GREEN}✅${NC} Backend API is responding"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} Backend API is not responding"
        echo -e "   ${YELLOW}Start with:${NC} cd server && npm run dev"
        ((FAIL++))
        return 1
    fi
}

echo "📁 Checking Configuration Files..."
echo "-----------------------------------"
check_file ".env"
check_file ".env.example"
check_file "server/.env"
check_file "server/.env.example"
check_file "server/package.json"
check_file "server/server.js"
echo ""

echo "📦 Checking Node Modules..."
echo "-----------------------------------"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅${NC} Frontend node_modules exists"
    ((PASS++))
else
    echo -e "${RED}❌${NC} Frontend node_modules missing"
    echo -e "   ${YELLOW}Run:${NC} npm install"
    ((FAIL++))
fi

if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✅${NC} Backend node_modules exists"
    ((PASS++))
else
    echo -e "${RED}❌${NC} Backend node_modules missing"
    echo -e "   ${YELLOW}Run:${NC} cd server && npm install"
    ((FAIL++))
fi
echo ""

echo "🗄️  Checking Database..."
echo "-----------------------------------"
check_mongodb
echo ""

echo "🌐 Checking Ports..."
echo "-----------------------------------"
check_port 27017 # MongoDB
check_port 5000  # Backend
check_port 5173  # Frontend
echo ""

echo "🔌 Checking API Connection..."
echo "-----------------------------------"
check_api
echo ""

echo "📊 Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! System is ready!${NC}"
    echo ""
    echo "Access your application:"
    echo "  🌐 Frontend: http://localhost:5173"
    echo "  🔐 Admin: http://localhost:5173/admin-login"
    echo "  📊 API Health: http://localhost:5000/api/health"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "Quick Start Commands:"
    echo "  1. Start MongoDB: brew services start mongodb-community@7.0"
    echo "  2. Start Backend: cd server && npm run dev"
    echo "  3. Start Frontend: npm run dev"
    exit 1
fi
